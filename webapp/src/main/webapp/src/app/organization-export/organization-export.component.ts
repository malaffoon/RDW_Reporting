import { Component, OnInit } from '@angular/core';
import { OrganizationType } from './organization/organization-type.enum';
import { TranslateService } from '@ngx-translate/core';
import { Tree } from './organization/tree';
import { Organization, School } from './organization/organization';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamFilterOptionsService } from '../assessments/filters/exam-filters/exam-filter-options.service';
import { NotificationService } from '../shared/notification/notification.service';
import { Option } from '../shared/form/sb-typeahead.component';
import { forkJoin, Subscription } from 'rxjs';
import { ApplicationSettingsService } from '../app-settings.service';
import { UserOrganizationService } from './organization/user-organization.service';
import { UserReportService } from '../report/user-report.service';
import { UserQueryService } from '../report/user-query.service';
import {
  getQueryFromRouteQueryParameters,
  isEqualReportQuery
} from '../report/reports';
import {
  DistrictSchoolExportReportQuery,
  ReportQuery,
  UserQuery
} from '../report/report';
import { Utils } from '../shared/support/support';
import { UserOrganizations } from './organization/user-organization';
import { createOptions } from './organization-exports';
import { createOrganizationTreeWithPlaceholders } from './organization/organization-trees';
import { createOrganizationExportQuery } from './organization-export-queries';
import { byString } from '@kourge/ordering/comparator';
import { ordering } from '@kourge/ordering';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

const byName = ordering(byString).on(({ name }) => name).compare;

@Component({
  selector: 'organization-export',
  templateUrl: './organization-export.component.html',
  styleUrls: ['./organization-export.component.less']
})
export class OrganizationExportComponent implements OnInit {
  /**
   * All unselected organizations
   */
  private _unselectedSchools: Organization[];

  /**
   * Organization options by UUID. This collection is used so that the option models can be created once and reused as needed.
   */
  private _organizationOptionsByUuid: Map<string, Option>;

  /**
   * Organization option view models computed from schools
   */
  organizationOptions: Option[];

  /**
   * Organization view model computed from schools
   */
  organizationTree: Tree<Organization>;

  /**
   * Available school year options
   */
  schoolYearOptions: number[];

  formGroup: FormGroup;
  transferAccess: boolean;
  userOrganizations: UserOrganizations;
  initialQuery: ReportQuery;
  private _userReportSubscription: Subscription;
  private _userQuerySubscription: Subscription;
  initialized: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private applicationSettingsService: ApplicationSettingsService,
    private userOrganizationService: UserOrganizationService,
    private filterOptionService: ExamFilterOptionsService,
    private notificationService: NotificationService,
    private userReportService: UserReportService,
    private userQueryService: UserQueryService
  ) {}

  ngOnInit(): void {
    forkJoin(
      this.applicationSettingsService.getSettings(),
      this.filterOptionService.getExamFilterOptions(),
      this.userOrganizationService.getUserOrganizations(),
      getQueryFromRouteQueryParameters<DistrictSchoolExportReportQuery>(
        this.route.snapshot.queryParams,
        this.userReportService,
        this.userQueryService
      )
    ).subscribe(([settings, options, userOrganizations, query]) => {
      const { userReportId, userQueryId } = this.route.snapshot.queryParams;

      const organizations = {
        ...userOrganizations,
        // pre-sorted so createOptions() results don't need to be sorted
        schools: userOrganizations.schools.slice().sort(byName)
      };

      // init form state from query or set to defaults
      const organizationExport =
        query != null
          ? {
              disableTransferAccess: query.disableTransferAccess,
              name:
                userReportId != null
                  ? Utils.appendOrIncrementFileNameSuffix(query.name)
                  : query.name,
              schools: organizations.schools.filter(
                ({ id, schoolGroupId, districtId }) =>
                  query.schoolIds.includes(id) ||
                  query.schoolGroupIds.includes(schoolGroupId) ||
                  query.districtIds.includes(districtId)
              ),
              schoolYear: query.schoolYear
            }
          : {
              disableTransferAccess: false,
              schools:
                organizations.schools.length == 1
                  ? [organizations.schools[0]]
                  : [],
              schoolYear: options.schoolYears[0]
            };

      this.userOrganizations = userOrganizations;
      this.transferAccess = settings.transferAccess;
      this.schoolYearOptions = options.schoolYears;

      // create all options and reuse them when calling createOptions()
      this._organizationOptionsByUuid = new Map<string, Option>(
        organizations.organizations.map(
          organization =>
            <any>[
              organization.uuid,
              {
                label: organization.name,
                group: this.translate.instant(
                  `organization-export.form.organization.type.${
                    OrganizationType[organization.type]
                  }`
                ),
                value: organization
              }
            ]
        )
      );

      this.formGroup = this.formBuilder.group({
        name: [organizationExport.name],
        disableTransferAccess: [
          {
            value: organizationExport.disableTransferAccess,
            disabled: !settings.transferAccess
          },
          [Validators.required]
        ],
        schools: [organizationExport.schools, [Validators.required]],
        schoolYear: [organizationExport.schoolYear, [Validators.required]]
      });

      // initialize selected schools based on user organizations
      // if the user only has one school to select, select it for them.
      this.selectedSchools = organizationExport.schools;
      if (userQueryId != null) {
        this.initialQuery = this.createQuery();
      }
      this.initialized = true;
    });
  }

  set selectedSchools(schools: School[]) {
    const { userOrganizations, _organizationOptionsByUuid } = this;

    this.formGroup.patchValue({ schools });

    this._unselectedSchools = userOrganizations.schools.filter(
      organization => !schools.some(x => x.id === organization.id)
    );

    // restrict allowed additions to one createDistrict maximum
    const districtRestrictedUnselectedOrganizations =
      schools.length == 0
        ? this._unselectedSchools
        : this._unselectedSchools.filter(
            x => x.districtId === schools[0].districtId
          );

    // recompute the options available in the search select
    this.organizationOptions = createOptions(
      districtRestrictedUnselectedOrganizations,
      _organizationOptionsByUuid
    );

    // recompute the organizations in the tree
    this.organizationTree = createOrganizationTreeWithPlaceholders(
      schools,
      userOrganizations
    ).sort(byName);
  }

  get selectedAll(): boolean {
    return (
      this.userOrganizations.schools.length ===
      this.formGroup.value.schools.length
    );
  }

  get selectAllEnabled(): boolean {
    return this.userOrganizations.districts.length < 2;
  }

  get editingDisabled(): boolean {
    return this.userOrganizations.schools.length <= 1;
  }

  get createQueryButtonDisabled(): boolean {
    return (
      this.formGroup.invalid ||
      this._userQuerySubscription != null ||
      this._userReportSubscription != null
    );
  }

  get updateQueryButtonDisabled(): boolean {
    return (
      this.createQueryButtonDisabled ||
      isEqualReportQuery(this.initialQuery, this.createQuery())
    );
  }

  get createReportButtonDisabled(): boolean {
    return this.formGroup.invalid || this._userReportSubscription != null;
  }

  add(organization: Organization): void {
    this.selectedSchools = [
      ...this.formGroup.value.schools,
      ...this._unselectedSchools.filter(unselected =>
        organization.isOrIsAncestorOf(unselected)
      )
    ];
  }

  addAll(): void {
    this.selectedSchools = this.userOrganizations.schools;
  }

  remove(organization: Organization): void {
    this.selectedSchools = this.formGroup.value.schools.filter(
      selected => !organization.isOrIsAncestorOf(selected)
    );
  }

  removeAll(): void {
    this.selectedSchools = [];
  }

  toggleSelectAll(): void {
    this.selectedAll ? this.removeAll() : this.addAll();
  }

  submit(): void {
    const query = this.createQuery();
    this._userReportSubscription = this.userReportService
      .createReport(query)
      .pipe(
        finalize(() => {
          this._userReportSubscription = null;
        })
      )
      .subscribe(
        () => {
          this.notificationService.info({
            id: 'report-download.submitted-message',
            html: true
          });
          this.router.navigate(['/reports']);
        },
        () => {
          this.notificationService.error({
            id: 'common.messages.submission-failed',
            html: true
          });
        }
      );
  }

  onCreateQueryButtonClick(): void {
    const query = this.createQuery();
    this._userQuerySubscription = this.userQueryService
      .createQuery(query)
      .pipe(
        finalize(() => {
          this._userQuerySubscription = null;
        })
      )
      .subscribe(
        userQuery => {
          this.router.navigate([], {
            relativeTo: this.route,
            replaceUrl: true,
            queryParams: {
              userQueryId: userQuery.id
            },
            queryParamsHandling: 'merge'
          });
          this.initialQuery = userQuery.query;
          this.notificationService.info({
            id: 'user-query.action.create.success',
            html: true
          });
        },
        () => {
          this.notificationService.error({
            id: 'user-query.action.create.error'
          });
        }
      );
  }

  onUpdateQueryButtonClick(): void {
    const userQuery = this.createUserQuery();
    this._userQuerySubscription = this.userQueryService
      .updateQuery(userQuery)
      .pipe(
        finalize(() => {
          this._userQuerySubscription = null;
        })
      )
      .subscribe(
        () => {
          this.initialQuery = userQuery.query;
          this.notificationService.info({
            id: 'user-query.action.update.success',
            html: true
          });
        },
        () => {
          this.notificationService.error({
            id: 'user-query.action.update.error'
          });
        }
      );
  }

  private createUserQuery(): UserQuery<DistrictSchoolExportReportQuery> {
    return {
      id: this.route.snapshot.queryParams.userQueryId,
      query: this.createQuery()
    };
  }

  private createQuery(): DistrictSchoolExportReportQuery {
    const { value } = this.formGroup;
    return createOrganizationExportQuery(
      {
        ...value,
        name:
          value.name ||
          this.translate.instant('organization-export.form.default-report-name')
      },
      this.userOrganizations
    );
  }
}
