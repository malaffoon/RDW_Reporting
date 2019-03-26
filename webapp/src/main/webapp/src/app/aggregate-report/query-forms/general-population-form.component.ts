import { Component } from '@angular/core';
import { AggregateReportColumnOrderItemProvider } from '../aggregate-report-column-order-item.provider';
import { AssessmentDefinitionService } from '../assessment/assessment-definition.service';
import { AggregateReportOrganizationService } from '../aggregate-report-organization.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AggregateReportTableDataService } from '../aggregate-report-table-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AggregateReportRequestMapper } from '../aggregate-report-request.mapper';
import { AggregateReportService } from '../aggregate-report.service';
import { AggregateReportOptionsMapper } from '../aggregate-report-options.mapper';
import { NotificationService } from '../../shared/notification/notification.service';
import { AssessmentDefinition } from '../assessment/assessment-definition';
import { ScrollNavItem } from '../../shared/nav/scroll-nav.component';
import { SubgroupFilterSupport } from '../subgroup/subgroup-filters';
import { SubgroupMapper } from '../subgroup/subgroup.mapper';
import { MultiOrganizationQueryFormComponent } from './multi-organization-query-form.component';
import { notEmpty } from '../../shared/form/validators';
import { SubjectService } from '../../subject/subject.service';
import { ReportQueryType } from '../../report/report';
import { UserQueryService } from '../../report/user-query.service';
import { canGetEstimatedRowCount } from '../support';

@Component({
  selector: 'general-population-form',
  templateUrl: './general-population-form.component.html'
})
export class GeneralPopulationFormComponent extends MultiOrganizationQueryFormComponent {
  assessmentDefinition: AssessmentDefinition;

  /**
   * Responsible for tracking form validity
   */
  formGroup: FormGroup;

  /**
   * Determines whether or not the advanced filters section is visible
   */
  showAdvancedFilters = false;

  constructor(
    protected columnOrderableItemProvider: AggregateReportColumnOrderItemProvider,
    protected notificationService: NotificationService,
    protected optionMapper: AggregateReportOptionsMapper,
    protected organizationService: AggregateReportOrganizationService,
    protected reportService: AggregateReportService,
    protected userQueryService: UserQueryService,
    protected subjectService: SubjectService,
    protected requestMapper: AggregateReportRequestMapper,
    protected route: ActivatedRoute,
    protected router: Router,
    protected subgroupMapper: SubgroupMapper,
    protected tableDataService: AggregateReportTableDataService,
    protected formBuilder: FormBuilder,
    protected assessmentDefinitionService: AssessmentDefinitionService
  ) {
    super(
      columnOrderableItemProvider,
      notificationService,
      optionMapper,
      organizationService,
      reportService,
      userQueryService,
      subjectService,
      requestMapper,
      route,
      router,
      subgroupMapper,
      tableDataService
    );
  }

  initialize(): void {
    super.initialize();

    this.settings.reportType = 'CustomAggregate';
    this.assessmentDefinition = this.assessmentDefinitionService.get(
      this.settings.assessmentType,
      this.settings.reportType
    );
    this.updateColumnOrder();
    this.showAdvancedFilters = !SubgroupFilterSupport.equals(
      this.settings.studentFilters,
      this.aggregateReportOptions.studentFilters
    );
    this.formGroup = this.formBuilder.group({
      organizations: [
        this.organizations,
        control => {
          return this.includeStateResults ||
            this.settings.includeAllDistricts ||
            control.value.length
            ? null
            : {
                invalid: {
                  messageId:
                    'aggregate-report-form.field.organization-invalid-error'
                }
              };
        }
      ],
      reportName: [this.settings.name],
      assessmentGrades: [
        this.settings.generalPopulation.assessmentGrades,
        notEmpty({
          messageId: 'aggregate-report-form.field.assessment-grades-empty-error'
        })
      ],
      schoolYears: [
        this.settings.generalPopulation.schoolYears,
        notEmpty({
          messageId: 'aggregate-report-form.field.school-year-empty-error'
        })
      ]
    });
  }

  getFormGroup(): FormGroup {
    return this.formGroup;
  }

  getAssessmentDefinition(): AssessmentDefinition {
    return this.assessmentDefinition;
  }

  getReportType(): ReportQueryType {
    return 'CustomAggregate';
  }

  getNavItems(): ScrollNavItem[] {
    return [
      {
        id: 'generalPopulationOrganizationSection',
        translationKey: 'aggregate-report-form.section.organization.heading'
      },
      {
        id: 'generalPopulationAssessmentSection',
        translationKey: 'aggregate-report-form.section.assessment-heading'
      },
      {
        id: 'generalPopulationSubgroupSection',
        translationKey:
          'aggregate-report-form.section.comparative-subgroups-heading'
      },
      {
        id: 'generalPopulationReviewSection',
        translationKey: 'aggregate-report-form.section.review-heading'
      },
      {
        id: 'generalPopulationPreviewSection',
        translationKey: 'aggregate-report-form.section.preview-heading'
      }
    ];
  }

  getSupportedAssessmentTypes(): string[] {
    return ['sum', 'ica', 'iab'];
  }

  onAssessmentTypeChange(): void {
    this.assessmentDefinition = this.assessmentDefinitionService.get(
      this.settings.assessmentType,
      this.settings.reportType
    );

    this.updateColumnOrder();
    this.markOrganizationsControlTouched();
    this.updateSubjectsEnabled();
    this.onSettingsChange();
  }

  capableOfRowEstimation(): boolean {
    const {
      schools,
      districts,
      generalPopulation: { assessmentGrades, schoolYears }
    } = this.settings;
    return canGetEstimatedRowCount(
      this.includeStateResults,
      schools,
      districts,
      assessmentGrades,
      schoolYears
    );
  }
}
