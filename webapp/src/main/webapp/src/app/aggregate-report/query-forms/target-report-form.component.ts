import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  District,
  Organization,
  OrganizationType,
  School
} from '../../shared/organization/organization';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AggregateReportOptionsMapper } from '../aggregate-report-options.mapper';
import { AggregateReportRequestMapper } from '../aggregate-report-request.mapper';
import { NotificationService } from '../../shared/notification/notification.service';
import { AggregateReportOrganizationService } from '../aggregate-report-organization.service';
import {
  AssessmentDefinitionService,
  TargetSummativeKey
} from '../assessment/assessment-definition.service';
import { AggregateReportService } from '../aggregate-report.service';
import { AggregateReportTableDataService } from '../aggregate-report-table-data.service';
import { AggregateReportColumnOrderItemProvider } from '../aggregate-report-column-order-item.provider';
import { SubgroupFilterSupport } from '../subgroup/subgroup-filters';
import { OrganizationTypeahead } from '../../shared/organization/organization-typeahead';
import { mergeMap } from 'rxjs/operators';
import { fileName } from '../../shared/form/validators';
import { AssessmentDefinition } from '../assessment/assessment-definition';
import { BaseAggregateQueryFormComponent } from './base-aggregate-query-form.component';
import { ScrollNavItem } from '../../shared/nav/scroll-nav.component';
import { SubjectService } from '../../subject/subject.service';
import { ReportQueryType } from '../../report/report';
import { UserQueryService } from '../../report/user-query.service';

@Component({
  selector: 'target-report-form',
  templateUrl: './target-report-form.component.html'
})
export class TargetReportFormComponent extends BaseAggregateQueryFormComponent {
  /**
   * The organization typeahead
   */
  @ViewChild('organizationTypeahead')
  set organizationTypeahead(value: OrganizationTypeahead) {
    this._organizationTypeahead = value;
    if (this.organization != null) {
      setTimeout(() => {
        this._organizationTypeahead.value = this.organization.name;
      });
    }
  }

  /**
   * Responsible for tracking form validity
   */
  formGroup: FormGroup;

  /**
   * The organization typeahead options
   */
  organizationTypeaheadOptions: Observable<Organization[]>;

  /**
   * The selected organization
   */
  organization: Organization;

  /**
   * Determines whether or not the advanced filters section is visible
   */
  showAdvancedFilters = false;

  assessmentDefinition: AssessmentDefinition;

  hasTargetEnabledSubjects: boolean;

  private _organizationTypeahead: OrganizationTypeahead;

  constructor(
    protected columnOrderableItemProvider: AggregateReportColumnOrderItemProvider,
    protected notificationService: NotificationService,
    protected optionMapper: AggregateReportOptionsMapper,
    protected reportService: AggregateReportService,
    protected userQueryService: UserQueryService,
    protected subjectService: SubjectService,
    protected requestMapper: AggregateReportRequestMapper,
    protected route: ActivatedRoute,
    protected router: Router,
    protected tableDataService: AggregateReportTableDataService,
    protected formBuilder: FormBuilder,
    protected organizationService: AggregateReportOrganizationService,
    protected assessmentDefinitionService: AssessmentDefinitionService
  ) {
    super(
      columnOrderableItemProvider,
      notificationService,
      optionMapper,
      reportService,
      userQueryService,
      subjectService,
      requestMapper,
      route,
      router,
      tableDataService
    );
  }

  initialize(): void {
    this.settings.reportType = 'Target';
    this.hasTargetEnabledSubjects = this.filteredOptions.subjects.some(
      subject =>
        subject.value.targetReport && subject.value.assessmentType === 'sum'
    );
    this.assessmentDefinition = this.assessmentDefinitionService.get(
      TargetSummativeKey.assessmentType,
      TargetSummativeKey.reportType
    );
    this.updateColumnOrder();
    this.showAdvancedFilters = !SubgroupFilterSupport.equals(
      this.settings.studentFilters,
      this.aggregateReportOptions.studentFilters
    );
    this.settings.includeAllDistricts = false;
    this.settings.includeStateResults = false;
    this.settings.includeAllDistrictsOfSelectedSchools = false;
    this.settings.includeAllSchoolsOfSelectedDistricts = false;
    if (this.settings.districts.length > 0) {
      this.organization = this.settings.districts[0];
      this.settings.districts = [<District>this.organization];
      this.settings.schools = [];
    } else if (this.settings.schools.length > 0) {
      this.organization = this.settings.schools[0];
      this.settings.schools = [<School>this.organization];
    }

    const defaultOrganization = this.aggregateReportOptions.defaultOrganization;
    if (!this.organization && defaultOrganization) {
      this.setOrganization(defaultOrganization);
    }

    if (!this.hasTargetEnabledSubjects) {
      this.settings.targetReport.subjectCode = undefined;
    }

    this.organizationTypeaheadOptions = Observable.create(observer => {
      observer.next(this._organizationTypeahead.value);
    }).pipe(
      mergeMap((search: string) =>
        this.organizationService.getOrganizationsMatchingName(search)
      )
    );

    this.formGroup = this.formBuilder.group({
      organization: [
        this.organization,
        control => {
          return control.value
            ? null
            : {
                invalid: {
                  messageId:
                    'aggregate-report-form.field.target.organization-invalid-error'
                }
              };
        }
      ],
      reportName: [
        this.settings.name,
        fileName({
          messageId: 'aggregate-report-form.field.report-name-file-name-error'
        })
      ],
      assessmentGrade: [this.settings.targetReport.assessmentGrade],
      schoolYear: [this.settings.targetReport.schoolYear],
      subject: [
        this.hasTargetEnabledSubjects,
        control => {
          return control.value
            ? null
            : {
                invalid: {
                  messageId:
                    'aggregate-report-form.field.target.subject-invalid-error'
                }
              };
        }
      ]
    });
  }

  getAssessmentDefinition(): AssessmentDefinition {
    return this.assessmentDefinition;
  }

  getFormGroup(): FormGroup {
    return this.formGroup;
  }

  getReportType(): ReportQueryType {
    return 'Target';
  }

  getNavItems(): ScrollNavItem[] {
    return [
      {
        id: 'targetOrganizationSection',
        translationKey: 'aggregate-report-form.section.organization.heading'
      },
      {
        id: 'targetAssessmentSection',
        translationKey: 'aggregate-report-form.section.assessment-heading'
      },
      {
        id: 'targetSubgroupSection',
        translationKey:
          'aggregate-report-form.section.comparative-subgroups-heading'
      },
      {
        id: 'targetReviewSection',
        translationKey: 'aggregate-report-form.section.review-heading'
      },
      {
        id: 'targetPreviewSection',
        translationKey: 'aggregate-report-form.section.preview-heading'
      }
    ];
  }

  getSupportedAssessmentTypes(): string[] {
    return ['sum'];
  }

  /**
   * Organization typeahead select handler
   *
   * @param organization the selected organization
   */
  onOrganizationTypeaheadSelect(organization: any): void {
    this.setOrganization(organization);
    this.onSettingsChange();
  }

  private setOrganization(organization: Organization): void {
    this.organization = organization;
    if (organization.type === OrganizationType.District) {
      this.settings.districts = [this.organization as District];
      this.settings.schools = [];
    } else if (organization.type === OrganizationType.School) {
      this.settings.districts = [];
      this.settings.schools = [this.organization as School];
    }
  }
}
