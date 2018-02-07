import { Component, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AggregateReportFormOptions } from "./aggregate-report-form-options";
import { AggregateReportFormSettings } from "./aggregate-report-form-settings";
import { NotificationService } from "../shared/notification/notification.service";
import { FormControl, FormGroup } from "@angular/forms";
import { Forms } from "../shared/form/forms";
import { District, Organization, OrganizationType, School } from "../shared/organization/organization";
import { Observable } from "rxjs/Observable";
import { OrganizationTypeahead } from "../shared/organization/organization-typeahead";
import { AggregateReportOrganizationService } from "./aggregate-report-organization.service";
import { AggregateReportService } from "./aggregate-report.service";
import { AggregateReportTable, SupportedRowCount } from "./results/aggregate-report-table.component";
import "rxjs/add/observable/interval";
import "rxjs/add/operator/switchMap";
import { BsModalService } from "ngx-bootstrap";
import { AggregateReportConfirmationModal } from "./aggregate-report-confirmation.modal";
import { Report } from "../report/report.model";
import { AggregateReportRequest } from "../report/aggregate-report-request";
import { AggregateReportFormOptionsMapper } from "./aggregate-report-form-options.mapper";
import { AggregateReportTableDataService } from "./aggregate-report-table-data.service";
import { AssessmentDefinition } from "./assessment/assessment-definition";
import { AggregateReportOptions } from "./aggregate-report-options";
import { AggregateReportItem } from "./results/aggregate-report-item";

/**
 * Form control validator that makes sure the control value is not an empty array
 *
 * @param properties the properties to propagate when the control value is invalid
 * @return any|null
 */
const notEmpty = properties => control => {
  return control.value.length ? null : { notEmpty: properties };
};

const OrganizationComparator = (a: Organization, b: Organization) => a.name.localeCompare(b.name);

const valuesOf = values => values.map(value => value.value);
const firstValueOf = values => values[ 0 ].value;
const codesOf = values => values.map(value => value.code);
const idsOf = values => values.map(value => value.id);

/**
 * Aggregate report form component
 */
@Component({
  selector: 'aggregate-report-form',
  templateUrl: './aggregate-report-form.component.html',
})
export class AggregateReportFormComponent {

  /**
   * Holds the form options
   */
  options: AggregateReportFormOptions;

  /**
   * Holds the form state
   */
  settings: AggregateReportFormSettings;

  /**
   * Responsible for tracking form validity
   */
  formGroup: FormGroup;

  /**
   * The organization typeahead
   */
  @ViewChild('organizationTypeahead')
  organizationTypeahead: OrganizationTypeahead;

  /**
   * The organization typeahead options
   */
  organizationTypeaheadOptions: Observable<Organization[]>;

  /**
   * The selected organizations
   */
  organizations: Organization[] = [];

  /**
   * The preview table data
   */
  previewTable: AggregateReportTable;

  /**
   * Holds the server report options
   */
  aggregateReportOptions: AggregateReportOptions;

  /**
   * Assessment definitions for use in generating sample data
   */
  assessmentDefinitionsByTypeCode: Map<string, AssessmentDefinition>;


  constructor(private router: Router,
              private route: ActivatedRoute,
              private optionMapper: AggregateReportFormOptionsMapper,
              private notificationService: NotificationService,
              private organizationService: AggregateReportOrganizationService,
              private reportService: AggregateReportService,
              private modalService: BsModalService,
              private tableDataService: AggregateReportTableDataService) {

    this.assessmentDefinitionsByTypeCode = route.parent.snapshot.data[ 'assessmentDefinitionsByAssessmentTypeCode' ];

    this.aggregateReportOptions = route.parent.snapshot.data[ 'options' ];

    this.options = optionMapper.map(this.aggregateReportOptions);

    this.organizationTypeaheadOptions = Observable.create(observer => {
      observer.next(this.organizationTypeahead.value);
    }).mergeMap(search => this.organizationService.getOrganizationsMatchingName(search)
      .map(organizations => organizations.filter(
        organization => this.organizations.findIndex(x => organization.equals(x)) === -1
      ))
    );

    this.settings = this.createDefaultSettings(this.options);

    this.formGroup = new FormGroup({
      organizations: new FormControl(this.organizations, notEmpty({
        messageId: 'aggregate-reports.form.field.organization.error-empty'
      })),
      assessmentGrades: new FormControl(this.settings.assessmentGrades, notEmpty({
        messageId: 'aggregate-reports.form.field.assessment-grades.error-empty'
      })),
      schoolYears: new FormControl(this.settings.schoolYears, notEmpty({
        messageId: 'aggregate-reports.form.field.school-year.error-empty'
      }))
    });

    this.previewTable = {
      assessmentDefinition: this.assessmentDefinitionsByTypeCode.get(this.settings.assessmentType.code),
      options: this.aggregateReportOptions,
      rows: []
    };

  }

  /**
   * @returns {boolean} True if the user does not have access to create aggregate reports
   */
  get accessDenied(): boolean {
    return this.aggregateReportOptions.assessmentTypes.length === 0;
  }

  /**
   * @returns {FormControl} The organizations form control
   */
  get organizationsControl(): FormControl {
    return <FormControl>this.formGroup.get('organizations');
  }

  /**
   * @returns {FormControl} The assessment grades form control
   */
  get assessmentGradesControl(): FormControl {
    return <FormControl>this.formGroup.get('assessmentGrades');
  }

  /**
   * @returns {FormControl} The school years form control
   */
  get schoolYearsControl(): FormControl {
    return <FormControl>this.formGroup.get('schoolYears');
  }

  /**
   * @returns {boolean} true if the control has errors and has been touched or dirtied
   */
  showErrors(formControl: FormControl): boolean {
    return Forms.showErrors(formControl);
  }

  /**
   * @returns {boolean} <code>true</code> if a non-interim assessment type is selected
   */
  get interimFieldsDisabled(): boolean {
    // TODO implement as !assessmentType.interim
    return this.settings.assessmentType.code === 'sum';
  }

  /**
   * @returns {boolean} <code>true</code> if an non-summative assessment type is selected
   */
  get summativeFieldsDisabled(): boolean {
    return !this.interimFieldsDisabled;
  }

  get currentAssessmentDefinition(): AssessmentDefinition {
    return this.assessmentDefinitionsByTypeCode.get(this.settings.assessmentType.code);
  }

  /**
   * Organization typeahead select handler
   *
   * @param organization the selected organization
   */
  onOrganizationTypeaheadSelect(organization: any): void {
    this.organizationTypeahead.value = '';
    this.addOrganization(organization);
  }

  /**
   * Organization list close handler
   *
   * @param organization
   */
  onOrganizationListItemClose(organization: any): void {
    this.removeOrganization(organization);
  }

  /**
   * Adds an organization to the selected organizations
   *
   * @param {Organization} organization
   */
  private addOrganization(organization: Organization): void {
    const finder = value => value.equals(organization);
    const index = this.organizations.findIndex(finder);
    if (index === -1) {
      // new array needed for change detection to kick in
      this.organizations = this.organizations.concat(organization);
      this.organizationsControl.markAsTouched();
      if (organization.type === OrganizationType.District) {
        this.settings.districts.push(<District>organization);
        this.settings.districts.sort(OrganizationComparator);
      } else if (organization.type === OrganizationType.School) {
        this.settings.schools.push(<School>organization);
        this.settings.schools.sort(OrganizationComparator);
      }
    }
  }

  /**
   * Removes an organization from the selected organizations
   *
   * @param {Organization} organization the organization to remove
   */
  private removeOrganization(organization: Organization): void {
    const finder = value => value.equals(organization);
    const index = this.organizations.findIndex(finder);
    if (index !== -1) {
      this.organizations = this.organizations.filter(value => !organization.equals(value));
      if (organization.type === OrganizationType.District) {
        this.settings.districts.splice(this.settings.districts.findIndex(finder), 1);
      } else if (organization.type === OrganizationType.School) {
        this.settings.schools.splice(this.settings.schools.findIndex(finder), 1);
      }
    }
  }

  /**
   * Creates a report if the form is valid
   */
  onGenerateButtonClick(): void {
    this.validate(this.formGroup, () => {
      const request = this.createReportRequest(this.settings);
      this.reportService.getEstimatedRowCount(request.reportQuery)
        .subscribe(
          count => {
            if (count < SupportedRowCount) {
              this.createViewableReport(request);
            } else {
              this.showConfirmationModal(count, () => this.createNonViewableReport(request))
            }
          }
        )
    });
  }

  /**
   * Creates a non viewable report if the form is valid
   */
  onExportButtonClick(): void {
    this.validate(this.formGroup, () => {
      this.createNonViewableReport(this.createReportRequest(this.settings));
    });
  }

  /**
   * Submits request to create report then navigates user to the report view page
   *
   * @param {AggregateReportRequest} request
   */
  private createViewableReport(request: AggregateReportRequest): void {
    this.createReport(request, resource => {
      this.router.navigate([ resource.id ], { relativeTo: this.route });
    })
  }

  /**
   * Submits request to create report then navigates user to the reports page
   *
   * @param {AggregateReportRequest} request
   */
  private createNonViewableReport(request: AggregateReportRequest): void {
    this.createReport(request, resource => {
      this.router.navigate([ 'reports' ]);
    })
  }

  /**
   * Creates a report and then calls the provided callback on success.
   * Displays failure notification if unsuccessful.
   *
   * @param {AggregateReportRequest} request
   * @param {(resource: Report) => void} onCreated
   */
  private createReport(request: AggregateReportRequest, onCreated: (resource: Report) => void): void {
    this.reportService.createReport(request)
      .subscribe(
        onCreated,
        error => {
          this.notificationService.error({ id: 'labels.reports.messages.submission-failed.html', html: true });
        }
      )
  }

  /**
   * Displays confirmation modal
   *
   * @param {number} rowCount the count of rows of the report request
   * @param {() => void} accept what to do when the modal is accepted
   */
  private showConfirmationModal(rowCount: number, accept: () => void): void {
    const modal = this.modalService.show(AggregateReportConfirmationModal);
    modal.content.rowCount = rowCount;
    modal.content.accept = accept;
  }

  /**
   * Validates the given form group and marks the controls as dirty.
   * If the form is valid the onValid callback will be called
   * If the form is invalid the notifications will be displayed to the user
   *
   * @param {FormGroup} formGroup
   * @param {Function} onValid
   */
  private validate(formGroup: FormGroup, onValid: () => void): void {

    // Mark form as dirty
    Forms.controls(this.formGroup)
      .forEach(control => control.markAsDirty());

    if (formGroup.valid) {
      // Execute callback if the form is valid
      onValid();
    } else {
      // Notify user of all form errors to correct
      Forms.errors(this.formGroup).forEach(error => {
        this.notificationService.error({ id: error.properties.messageId });
      });
    }
  }

  /**
   * Creates the default/initial state of the aggregate report form based on the available options
   *
   * @param {AggregateReportFormOptions} options the options available for selection
   * @returns {AggregateReportFormSettings} the initial form state
   */
  private createDefaultSettings(options: AggregateReportFormOptions): AggregateReportFormSettings {
    return <AggregateReportFormSettings>{
      assessmentGrades: [],
      assessmentType: firstValueOf(options.assessmentTypes),
      completenesses: [ firstValueOf(options.completenesses) ],
      ethnicities: valuesOf(options.ethnicities),
      genders: valuesOf(options.genders),
      interimAdministrationConditions: [ firstValueOf(options.interimAdministrationConditions) ],
      schoolYears: [ firstValueOf(options.schoolYears) ],
      subjects: valuesOf(options.subjects),
      summativeAdministrationConditions: [ firstValueOf(options.summativeAdministrationConditions) ],
      migrantStatuses: valuesOf(options.migrantStatuses),
      individualEducationPlans: valuesOf(options.individualEducationPlans),
      section504s: valuesOf(options.section504s),
      limitedEnglishProficiencies: valuesOf(options.limitedEnglishProficiencies),
      economicDisadvantages: valuesOf(options.economicDisadvantages),
      performanceLevelDisplayType: firstValueOf(options.performanceLevelDisplayTypes),
      valueDisplayType: firstValueOf(options.valueDisplayTypes),
      dimensionTypes: [],
      includeStateResults: true,
      includeAllDistricts: false,
      includeAllSchoolsOfSelectedDistricts: false,
      includeAllDistrictsOfSelectedSchools: true,
      districts: [],
      schools: []
    };
  }

  /**
   * Creates an aggregate report request from a
   *
   * @param {AggregateReportFormSettings} settings the form state
   * @returns {AggregateReportRequest} the created request
   */
  private createReportRequest(settings: AggregateReportFormSettings): AggregateReportRequest {
    return {
      name: 'Custom Aggregate Report', // TODO add form field for name
      reportQuery: {
        achievementLevelDisplayType: settings.performanceLevelDisplayType,
        administrationConditionCodes: codesOf(
          settings.interimAdministrationConditions.concat(settings.summativeAdministrationConditions)
        ),
        assessmentGradeCodes: codesOf(settings.assessmentGrades),
        assessmentTypeCode: settings.assessmentType.code,
        completenessCodes: codesOf(settings.completenesses),
        economicDisadvantageCodes: codesOf(settings.economicDisadvantages),
        ethnicityCodes: codesOf(settings.ethnicities),
        dimensionTypes: settings.dimensionTypes,
        districtIds: idsOf(settings.districts),
        genderCodes: codesOf(settings.genders),
        iepCodes: codesOf(settings.individualEducationPlans),
        includeAllDistricts: settings.includeAllDistricts,
        includeAllDistrictsOfSchools: settings.includeAllDistrictsOfSelectedSchools,
        includeAllSchoolsOfDistricts: settings.includeAllSchoolsOfSelectedDistricts,
        includeState: settings.includeStateResults,
        lepCodes: codesOf(settings.limitedEnglishProficiencies),
        migrantStatusCodes: codesOf(settings.migrantStatuses),
        section504Codes: codesOf(settings.section504s),
        schoolYears: settings.schoolYears,
        schoolIds: idsOf(settings.schools),
        subjectCodes: codesOf(settings.subjects),
        valueDisplayType: settings.valueDisplayType
      }
    }
  }

  /**
   * Reloads the report preview based on current form state
   */
  onSettingsChange() {
    const assessmentDefinition = this.currentAssessmentDefinition;
    this.previewTable = {
      rows: this.tableDataService.createSampleData(assessmentDefinition, this.settings),
      options: this.aggregateReportOptions,
      assessmentDefinition: assessmentDefinition
    };
  }

}
