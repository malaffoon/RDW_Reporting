import { Component } from '@angular/core';
import { AggregateReportColumnOrderItemProvider } from '../aggregate-report-column-order-item.provider';
import { AssessmentDefinitionService } from '../assessment/assessment-definition.service';
import { AggregateReportOrganizationService } from '../aggregate-report-organization.service';
import { FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
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
import { isGreaterThan } from '../../shared/form/validators';
import { SubjectService } from '../../subject/subject.service';
import { canGetEstimatedRowCount, computeEffectiveYears } from '../support';
import { SchoolYearPipe } from '../../shared/format/school-year.pipe';
import { ReportQueryType } from '../../report/report';
import { UserQueryService } from '../../report/user-query.service';

/**
 * Disable StudentEnrolledGrade as a longitudinal dimension type
 * because the value varies year-over-year.
 * @type {[string]}
 */
const DisallowedDimensions = ['StudentEnrolledGrade'];

@Component({
  selector: 'longitudinal-cohort-form',
  templateUrl: './longitudinal-cohort-form.component.html'
})
export class LongitudinalCohortFormComponent extends MultiOrganizationQueryFormComponent {
  assessmentDefinition: AssessmentDefinition;

  /**
   * Responsible for tracking form validity
   */
  formGroup: FormGroup;

  /**
   * Determines whether or not the advanced filters section is visible
   */
  showAdvancedFilters = false;

  private lowestAvailableSchoolYear: number;

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
    protected assessmentDefinitionService: AssessmentDefinitionService,
    private schoolYearPipe: SchoolYearPipe
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

    this.settings.reportType = 'Longitudinal';
    this.settings.assessmentType = 'sum';

    //Strip disallowed dimension types
    this.filteredOptions.dimensionTypes = this.filteredOptions.dimensionTypes.filter(
      ({ value }) => !DisallowedDimensions.includes(value)
    );
    if (this.settings.dimensionTypes) {
      this.settings.dimensionTypes = this.settings.dimensionTypes.filter(
        value => !DisallowedDimensions.includes(value)
      );
    }

    this.assessmentDefinition = this.assessmentDefinitionService.get(
      this.settings.assessmentType,
      this.settings.reportType
    );
    this.updateColumnOrder();
    this.showAdvancedFilters = !SubgroupFilterSupport.equals(
      this.settings.studentFilters,
      this.aggregateReportOptions.studentFilters
    );
    this.lowestAvailableSchoolYear = Math.min(
      ...this.filteredOptions.schoolYears.map(schoolYear => schoolYear.value)
    );
    this.formGroup = this.formBuilder.group(
      {
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
        assessmentGradeRange: [
          this.settings.longitudinalCohort.assessmentGrades,
          [
            isGreaterThan(1, {
              messageId:
                'aggregate-report-form.field.assessment-grades-less-than-minimum-error'
            })
          ]
        ],
        toSchoolYear: [this.settings.longitudinalCohort.toSchoolYear]
      },
      {
        validator: [
          this.withinBounds(this.lowestAvailableSchoolYear, {
            messageId:
              'aggregate-report-form.field.assessment-grades-exceed-available-school-years-error',
            args: {
              lowestAvailableSchoolYear: this.schoolYearPipe.transform(
                this.lowestAvailableSchoolYear
              )
            }
          })
        ]
      }
    );
  }

  getFormGroup(): FormGroup {
    return this.formGroup;
  }

  getAssessmentDefinition(): AssessmentDefinition {
    return this.assessmentDefinition;
  }

  getReportType(): ReportQueryType {
    return 'Longitudinal';
  }

  getNavItems(): ScrollNavItem[] {
    return [
      {
        id: 'longitudinalCohortOrganizationSection',
        translationKey: 'aggregate-report-form.section.organization.heading'
      },
      {
        id: 'longitudinalCohortAssessmentSection',
        translationKey: 'aggregate-report-form.section.assessment-heading'
      },
      {
        id: 'longitudinalCohortSubgroupSection',
        translationKey:
          'aggregate-report-form.section.comparative-subgroups-heading'
      },
      {
        id: 'longitudinalCohortReviewSection',
        translationKey: 'aggregate-report-form.section.review-heading'
      },
      {
        id: 'longitudinalCohortPreviewSection',
        translationKey: 'aggregate-report-form.section.preview-heading'
      }
    ];
  }

  getSupportedAssessmentTypes(): string[] {
    return ['sum'];
  }

  onAssessmentTypeChange(): void {
    this.assessmentDefinition = this.assessmentDefinitionService.get(
      this.settings.assessmentType,
      this.settings.reportType
    );

    this.updateColumnOrder();
    this.markOrganizationsControlTouched();
    this.onSettingsChange();
  }

  capableOfRowEstimation(): boolean {
    const {
      schools,
      districts,
      longitudinalCohort: { assessmentGrades, toSchoolYear }
    } = this.settings;
    return canGetEstimatedRowCount(
      this.includeStateResults,
      schools,
      districts,
      assessmentGrades,
      [toSchoolYear].filter(value => value != null)
    );
  }

  /**
   * Form control validator that makes sure the computed effective years does not go below the selected school year
   *
   * @param {number} lowestAvailableSchoolYear the lowest school year we allow in the application
   * @param properties the properties to propagate when the control value is invalid
   * @returns {ValidatorFn}
   */
  private withinBounds(
    lowestAvailableSchoolYear: number,
    properties: any
  ): ValidatorFn {
    return control => {
      if (
        (control.get('toSchoolYear') || control.get('assessmentGradeRange')) ===
        null
      ) {
        return null;
      }
      const effectiveSchoolYears = computeEffectiveYears(
        control.get('toSchoolYear').value,
        control.get('assessmentGradeRange').value
      );
      if (lowestAvailableSchoolYear > Math.min(...effectiveSchoolYears)) {
        return { withinBounds: properties };
      }
      return null;
    };
  }
}
