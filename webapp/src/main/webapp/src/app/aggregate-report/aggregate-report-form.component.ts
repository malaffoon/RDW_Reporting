import { Component, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AggregateReportFormOptions } from "./aggregate-report-form-options";
import { AggregateReportFormSettings } from "./aggregate-report-form-settings";
import { NotificationService } from "../shared/notification/notification.service";
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Forms } from "../shared/form/forms";
import { District, Organization, OrganizationType, School } from "../shared/organization/organization";
import { Observable } from "rxjs/Observable";
import { OrganizationTypeahead } from "../shared/organization/organization-typeahead";
import { AggregateReportOrganizationService } from "./aggregate-report-organization.service";
import { AggregateReportService } from "./aggregate-report.service";
import { AggregateReportTable, SupportedRowCount } from "./results/aggregate-report-table.component";
import { BasicAggregateReportRequest } from "../report/basic-aggregate-report-request";
import { AggregateReportOptionsMapper } from "./aggregate-report-options.mapper";
import { AggregateReportTableDataService } from "./aggregate-report-table-data.service";
import { AssessmentDefinition } from "./assessment/assessment-definition";
import { AggregateReportOptions } from "./aggregate-report-options";
import { AggregateReportRequestMapper } from "./aggregate-report-request.mapper";
import { AggregateReportColumnOrderItemProvider } from "./aggregate-report-column-order-item.provider";
import { OrderableItem } from "../shared/order-selector/order-selector.component";
import { AggregateReportRequestSummary } from "./aggregate-report-summary.component";
import { Subscription } from "rxjs/Subscription";
import { debounceTime, finalize, map, mergeMap } from "rxjs/operators";
import { Observer } from "rxjs/Observer";
import { ranking } from '@kourge/ordering/comparator';
import { ordering } from '@kourge/ordering';
import { SubgroupFilters, SubgroupFilterSupport } from "./subgroup-filters";
import { SubgroupMapper } from "./subgroup.mapper";
import { SubgroupFiltersListItem } from './subgroup-filters-list-item';

const DefaultRenderDebounceMilliseconds = 500;

/**
 * Form control validator that makes sure the control value is not an empty array
 *
 * @param properties the properties to propagate when the control value is invalid
 * @return {null|{notEmpty: any}}}
 */
const notEmpty = properties => control => {
  return control.value.length ? null : { notEmpty: properties };
};

/**
 * Form control validator that makes sure the control value is a valid filename
 *
 * @param properties the properties to propagate when the control value is invalid
 * @return {null|{fileName: any}}}
 */
const fileName = (properties: any) => control => {
  return /^[^\\<>:;,?"*|/]*$/.test((control.value || '').trim()) ? null : { fileName: properties };
};

const OrganizationComparator = (a: Organization, b: Organization) => a.name.localeCompare(b.name);

/**
 * Aggregate report form component
 */
@Component({
  selector: 'aggregate-report-form',
  templateUrl: './aggregate-report-form.component.html'
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

  /**
   * Estimated row count based on the given report form settings
   */
  estimatedRowCount: number;

  /**
   * The report request summary view
   */
  summary: AggregateReportRequestSummary;

  /**
   * The current column order
   */
  columnItems: OrderableItem[];

  /**
   * Determines whether or not the advanced filters section is visible
   */
  showAdvancedFilters: boolean = false;

  /**
   * Handle on the request submission
   */
  submissionSubscription: Subscription;

  /**
   * This observer's next() method is to be invoked when a change happens to the form inputs
   * This is then piped through a debounce operator in order to make the form more responsive when the user makes
   * quick successive changes
   */
  settingsChangedObserver: Observer<void>;

  /**
   * Holds the custom subgroup form state
   */
  customSubgroup: SubgroupFilters;

  /**
   * Custom subgroup display items
   */
  subgroupItems: SubgroupFiltersListItem[] = [];

  constructor(@Inject(FormBuilder) formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private optionMapper: AggregateReportOptionsMapper,
              private requestMapper: AggregateReportRequestMapper,
              private notificationService: NotificationService,
              private organizationService: AggregateReportOrganizationService,
              private reportService: AggregateReportService,
              private tableDataService: AggregateReportTableDataService,
              private columnOrderableItemProvider: AggregateReportColumnOrderItemProvider,
              private subgroupMapper: SubgroupMapper) {

    this.assessmentDefinitionsByTypeCode = route.snapshot.data[ 'assessmentDefinitionsByAssessmentTypeCode' ];
    this.aggregateReportOptions = route.snapshot.data[ 'options' ];
    this.settings = route.snapshot.data[ 'settings' ];

    this.customSubgroup = SubgroupFilterSupport.copy(this.aggregateReportOptions.studentFilters);
    this.subgroupItems = this.settings.subgroups
      .map(subgroup => this.subgroupMapper.createSubgroupFiltersListItem(subgroup));

    this.showAdvancedFilters = !SubgroupFilterSupport.equals(this.settings.studentFilters, this.aggregateReportOptions.studentFilters);

    this.organizations = this.organizations.concat(this.settings.districts, this.settings.schools);

    const defaultOrganization = this.aggregateReportOptions.defaultOrganization;
    if (this.organizations.length === 0 && defaultOrganization) {
      this.addOrganizationToSettings(defaultOrganization);
    }

    this.columnItems = this.columnOrderableItemProvider.toOrderableItems(this.settings.columnOrder);

    this.options = optionMapper.map(this.aggregateReportOptions);

    this.organizationTypeaheadOptions = Observable.create(observer => {
      observer.next(this.organizationTypeahead.value);
    }).pipe(
      mergeMap((search: string) => this.organizationService.getOrganizationsMatchingName(search)),
      map((organizations: Organization[]) => organizations.filter(
        organization => this.organizations.findIndex(x => organization.equals(x)) === -1
      ))
    );

    this.formGroup = formBuilder.group({
      organizations: [
        this.organizations,
        control => {
          return this.includeStateResults
            || this.settings.includeAllDistricts
            || control.value.length
              ? null
              : { invalid: { messageId: 'aggregate-report-form.field.organization-invalid-error' } };
        }
      ],
      reportName: [
        this.settings.name,
        fileName({ messageId: 'aggregate-report-form.field.report-name-file-name-error' })
      ],
      assessmentGrades: [ this.settings.generalPopulation.assessmentGrades ],
      schoolYears: [ this.settings.generalPopulation.schoolYears ],
      assessmentGradeRange: [ this.settings.longitudinalCohort.assessmentGrades ],
      toSchoolYear: [ this.settings.longitudinalCohort.toSchoolYear ],
    });

    this.updateValidators();

    Observable.create((observer) => this.settingsChangedObserver = observer)
      .pipe(debounceTime(DefaultRenderDebounceMilliseconds))
      .subscribe(() => this.applySettingsChange());
  }

  ngOnInit(): void {
    this.onSettingsChange();
  }

  private updateValidators(): void {
    const setValidators = (control: FormControl, validators: ValidatorFn | ValidatorFn[] | null): void => {
      control.setValidators(validators);
      control.updateValueAndValidity();
    };

    if (this.settings.reportType === 'GeneralPopulation') {
      setValidators(this.assessmentGradesControl, [
        notEmpty({ messageId: 'aggregate-report-form.field.assessment-grades-empty-error' })
      ]);
      setValidators(this.schoolYearsControl, [
        notEmpty({ messageId: 'aggregate-report-form.field.school-year-empty-error' })
      ]);
      setValidators(this.assessmentGradeRangeControl, null);
    } else {
      setValidators(this.assessmentGradesControl, null);
      setValidators(this.schoolYearsControl, null);
      setValidators(this.assessmentGradeRangeControl, [
        notEmpty({ messageId: 'aggregate-report-form.field.assessment-grades-empty-error' })
      ]);
    }
  }

  /**
   * @returns {boolean} True if the default organization exists and it is a school
   */
  get hasDefaultSchoolOrganization(): boolean {
    return this.defaultOrganization && this.defaultOrganization.type === OrganizationType.School;
  }

  /**
   * @returns {Organization} The default organization, if one exists
   */
  get defaultOrganization(): Organization {
    return this.aggregateReportOptions.defaultOrganization;
  }

  /**
   * @returns {boolean} True if the user does not have access to create aggregate reports
   */
  get accessDenied(): boolean {
    return this.aggregateReportOptions.assessmentTypes.length === 0;
  }

  get organizationsControl(): FormControl {
    return <FormControl>this.formGroup.get('organizations');
  }

  get assessmentGradesControl(): FormControl {
    return <FormControl>this.formGroup.get('assessmentGrades');
  }

  get schoolYearsControl(): FormControl {
    return <FormControl>this.formGroup.get('schoolYears');
  }

  get reportNameControl(): FormControl {
    return <FormControl>this.formGroup.get('reportName');
  }

  get assessmentGradeRangeControl(): FormControl {
    return <FormControl>this.formGroup.get('assessmentGradeRange');
  }

  get toSchoolYearControl(): FormControl {
    return <FormControl>this.formGroup.get('toSchoolYear');
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
    return !this.currentAssessmentDefinition.interim;
  }

  /**
   * @returns {boolean} <code>true</code> if an non-summative assessment type is selected
   */
  get summativeFieldsDisabled(): boolean {
    return !this.interimFieldsDisabled;
  }

  get currentAssessmentDefinition(): AssessmentDefinition {
    return this.assessmentDefinitionsByTypeCode.get(this.settings.assessmentType);
  }

  get estimatedRowCountIsLarge(): boolean {
    return this.estimatedRowCount > SupportedRowCount;
  }

  get includeStateResults(): boolean {
    return this.settings.includeStateResults && !this.summativeFieldsDisabled;
  }

  set includeStateResults(value: boolean) {
    this.settings.includeStateResults = value;
  }

  get createCustomSubgroupButtonDisabled(): boolean {
    return SubgroupFilterSupport.equals(this.customSubgroup, this.aggregateReportOptions.studentFilters)
      || this.settings.subgroups.some(subgroup => SubgroupFilterSupport.equals(
        subgroup,
        SubgroupFilterSupport.leftDifference(this.customSubgroup, this.aggregateReportOptions.studentFilters)
      ));
  }

  onReportTypeChange(): void {
    this.updateValidators();
    this.onSettingsChange();
  }

  onTabChange(queryType: 'Basic' | 'FilteredSubgroup'): void {
    this.settings.queryType = queryType;
    this.onSettingsChange();
  }

  onCreateCustomSubgroupButtonClick(): void {
    this.settings.subgroups = this.settings.subgroups.concat([
      SubgroupFilterSupport.leftDifference(this.customSubgroup, this.aggregateReportOptions.studentFilters)
    ]);
    this.subgroupItems = this.settings.subgroups
      .map(subgroup => this.subgroupMapper.createSubgroupFiltersListItem(subgroup));

    this.onSettingsChange();
  }

  onCustomSubgroupItemRemoveButtonClick(item: SubgroupFiltersListItem): void {
    this.settings.subgroups = this.settings.subgroups
      .filter(subgroup => subgroup !== item.value);
    this.subgroupItems = this.subgroupItems
      .filter(subgroupItem => subgroupItem !== item);
    this.onSettingsChange();
  }

  /**
   * Organization typeahead select handler
   *
   * @param organization the selected organization
   */
  onOrganizationTypeaheadSelect(organization: any): void {
    this.organizationTypeahead.value = '';
    this.addOrganization(organization);
    this.markOrganizationsControlTouched();
    this.onSettingsChange();
  }

  /**
   * Organization list close handler
   *
   * @param organization
   */
  onOrganizationListItemClose(organization: any): void {
    this.removeOrganization(organization);
    this.onSettingsChange();
  }

  onIncludeStateResultsChange(): void {
    this.markOrganizationsControlTouched();
    this.onSettingsChange();
  }

  onIncludeAllDistrictsChange(): void {
    this.markOrganizationsControlTouched();
    this.onSettingsChange();
  }

  onAdvancedFiltersExpanderButtonClick(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  onAssessmentTypeChange(): void {

    // Preserve column order between changing assessment types
    const currentOrder = this.settings.columnOrder.concat();
    if (!currentOrder.includes('assessmentLabel')) {
      currentOrder.splice(currentOrder.indexOf('assessmentGrade') + 1, 0, 'assessmentLabel');
    }
    const order = this.currentAssessmentDefinition.aggregateReportIdentityColumns.concat()
      .sort(ordering(ranking(currentOrder)).compare);

    this.settings.columnOrder = order;
    this.columnItems = this.columnOrderableItemProvider.toOrderableItems(order);

    this.markOrganizationsControlTouched();
    this.onSettingsChange();
  }

  onColumnOrderChange(items: OrderableItem[]): void {
    this.settings.columnOrder = items.map(item => item.value);
  }

  /**
   * Reloads the report preview based on current form state
   */
  onSettingsChange(): void {

    // informs the view that it should display a loader
    this.estimatedRowCount = undefined;

    // informs the debounced observable that the view has changed
    this.settingsChangedObserver.next(undefined);
  }

  /**
   * Creates a report if the form is valid
   */
  onGenerateButtonClick(): void {
    this.validate(this.formGroup, () => {
      this.submissionSubscription = this.reportService.createReport(this.createReportRequest())
        .pipe(
          finalize(() => {
            this.submissionSubscription.unsubscribe();
            this.submissionSubscription = undefined;
          })
        )
        .subscribe(
          resource => {
            this.router.navigate([ resource.id ], { relativeTo: this.route });
          },
          error => {
            this.notificationService.error({ id: 'common.messages.submission-failed', html: true });
          }
        );
    });
  }

  private markOrganizationsControlTouched(): void {
    this.organizationsControl.setValue(this.organizations);
    this.organizationsControl.markAsDirty();
    this.organizationsControl.updateValueAndValidity();
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
      this.addOrganizationToSettings(organization);
    }
  }

  private addOrganizationToSettings(organization: Organization): void {
    this.organizations = this.organizations.concat(organization);
    if (organization.type === OrganizationType.District) {
      this.settings.districts = this.settings.districts
        .concat(<District>organization)
        .sort(OrganizationComparator);
    } else if (organization.type === OrganizationType.School) {
      this.settings.schools = this.settings.schools
        .concat(<School>organization)
        .sort(OrganizationComparator);
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
      this.removeOrganizationFromSettings(organization);
    }
  }

  private removeOrganizationFromSettings(organization: Organization): void {
    this.organizations = this.organizations.filter(value => !organization.equals(value));
    if (organization.type === OrganizationType.District) {
      this.settings.districts = this.settings.districts
        .filter(district => !organization.equals(district));
    } else if (organization.type === OrganizationType.School) {
      this.settings.schools = this.settings.schools
        .filter(school => !organization.equals(school));
    }
    this.markOrganizationsControlTouched();
  }

  private applySettingsChange(): void {
    if (this.formGroup.valid) {
      this.reportService.getEstimatedRowCount(this.createReportRequest().query)
        .subscribe(count => this.estimatedRowCount = count);
    }

    this.summary = {
      assessmentDefinition: this.currentAssessmentDefinition,
      options: this.aggregateReportOptions,
      settings: this.settings
    };

    // TODO this table should be lazily updated when it is scrolled into view. There is serious lag when changing settings above
    this.previewTable = {
      assessmentDefinition: this.currentAssessmentDefinition,
      options: this.aggregateReportOptions,
      rows: this.tableDataService.createSampleData(this.currentAssessmentDefinition, this.settings)
    };

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

    this.formGroup.updateValueAndValidity();

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
   * Creates an aggregate report request from a
   *
   * @returns {BasicAggregateReportRequest} the created request
   */
  private createReportRequest(): BasicAggregateReportRequest {
    return this.requestMapper.map(this.options, this.settings, this.currentAssessmentDefinition);
  }

}


