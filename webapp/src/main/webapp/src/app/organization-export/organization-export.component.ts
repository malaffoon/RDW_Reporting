import { Component, OnInit } from '@angular/core';
import { OrganizationType } from './organization/organization-type.enum';
import { TranslateService } from '@ngx-translate/core';
import { Tree } from './organization/tree';
import { Organization } from './organization/organization';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamFilterOptionsService } from '../assessments/filters/exam-filters/exam-filter-options.service';
import { OrganizationExport } from './organization-export';
import { NotificationService } from '../shared/notification/notification.service';
import { Option } from '../shared/form/sb-typeahead.component';
import { forkJoin } from 'rxjs';
import { ApplicationSettingsService } from '../app-settings.service';
import { UserOrganizationService } from './organization/user-organization.service';
import { UserReportService } from '../report/user-report.service';
import { UserQueryService } from '../report/user-query.service';
import { getQueryFromRouteQueryParameters } from '../report/reports';
import { DistrictSchoolExportReportQuery } from '../report/report';
import { Utils } from '../shared/support/support';
import { isEqual, cloneDeep } from 'lodash';
import { UserOrganizations } from './organization/user-organization';
import { createOptions } from './organization-exports';
import { createOrganizationTreeWithPlaceholders } from './organization/organization-trees';
import { createOrganizationExportQuery } from './organization-export-queries';

@Component({
  selector: 'organization-export',
  templateUrl: './organization-export.component.html'
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
  private _organizationOptions: Option[];

  /**
   * Organization view model computed from schools
   */
  private _organizationTree: Tree<Organization>;

  /**
   * Available school year options
   */
  private _schoolYearOptions: number[];

  /**
   * The sort order of the organizations
   */
  private _comparator = (a: Organization, b: Organization) =>
    a.name && b.name ? a.name.localeCompare(b.name) : 0;

  transferAccess: boolean;
  showSaveQueryButton: boolean;
  userOrganizations: UserOrganizations;
  organizationExport: OrganizationExport;
  initialOrganizationExport: OrganizationExport;
  initialized: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
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

      this.userOrganizations = userOrganizations;
      this.transferAccess = true; //settings.transferAccess;

      // initialize selected school year based on options
      this._schoolYearOptions = options.schoolYears;

      const organizations = {
        ...userOrganizations,
        // pre-sorted so createOptions() results don't need to be sorted
        schools: userOrganizations.schools.slice().sort(this._comparator)
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
              organizations,
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
              organizations,
              schools: [],
              schoolYear: options.schoolYears[0]
            };

      this.initialOrganizationExport = organizationExport;
      this.organizationExport = cloneDeep(organizationExport);

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

      // initialize selected schools based on user organizations
      // if the user only has one school to select, select it for them.
      this.selectedSchools =
        query != null
          ? this.organizationExport.schools.slice()
          : organizations.schools.length == 1
          ? [organizations.schools[0]]
          : [];

      this.showSaveQueryButton = userQueryId != null;
      this.initialized = true;
    });
  }

  get selectedSchools(): Organization[] {
    return this.organizationExport.schools;
  }

  set selectedSchools(value: Organization[]) {
    if (this.organizationExport.schools !== value) {
      this.organizationExport.schools = value;

      this._unselectedSchools = this.userOrganizations.schools.filter(
        organization => !value.some(x => x.id === organization.id)
      );

      // restrict allowed additions to one createDistrict maximum
      let districtRestrictedUnselectedOrganizations =
        this.organizationExport.schools.length == 0
          ? this._unselectedSchools
          : this._unselectedSchools.filter(
              x =>
                x.districtId === this.organizationExport.schools[0].districtId
            );

      // recompute the options available in the search select
      this._organizationOptions = createOptions(
        districtRestrictedUnselectedOrganizations,
        this._organizationOptionsByUuid
      );

      // recompute the organizations in the tree
      this._organizationTree = createOrganizationTreeWithPlaceholders(
        value,
        this.userOrganizations
      ).sort(this._comparator);
    }
  }

  get selectedAll(): boolean {
    return (
      this.userOrganizations.schools.length ===
      this.organizationExport.schools.length
    );
  }

  get organizationOptions(): Option[] {
    return this._organizationOptions;
  }

  get organizationTree(): Tree<Organization> {
    return this._organizationTree;
  }

  get selectAllEnabled(): boolean {
    return this.userOrganizations.districts.length < 2;
  }

  get editingDisabled(): boolean {
    return this.userOrganizations.schools.length <= 1;
  }

  get schoolYearOptions(): number[] {
    return this._schoolYearOptions;
  }

  get userQueryHasChanged(): boolean {
    return !isEqual(this.initialOrganizationExport, this.organizationExport);
  }

  add(organization: Organization): void {
    this.selectedSchools = [
      ...this.organizationExport.schools,
      ...this._unselectedSchools.filter(unselected =>
        organization.isOrIsAncestorOf(unselected)
      )
    ];
  }

  addAll(): void {
    this.selectedSchools = this.userOrganizations.schools;
  }

  remove(organization: Organization): void {
    this.selectedSchools = this.selectedSchools.filter(
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
    const query = createOrganizationExportQuery(
      {
        ...this.organizationExport,
        name:
          this.organizationExport.name ||
          this.translate.instant('organization-export.form.default-report-name')
      },
      this.userOrganizations
    );

    this.userReportService.createReport(query).subscribe(
      () => {
        this.notificationService.info({
          id: 'organization-export.form.submit.success-html',
          html: true
        });
        this.router.navigate(['/reports']);
      },
      () =>
        this.notificationService.error({
          id: 'organization-export.form.submit.failure'
        })
    );
  }

  onSaveQueryButtonClick(): void {
    // this.userQueryService.updateQuery()
  }
}
