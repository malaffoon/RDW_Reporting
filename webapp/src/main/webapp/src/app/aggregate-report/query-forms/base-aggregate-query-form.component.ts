import { AggregateReportRequest } from "../../report/aggregate-report-request";
import { AbstractControl, FormGroup } from '@angular/forms';
import { Forms } from "../../shared/form/forms";
import { NotificationService } from "../../shared/notification/notification.service";
import { AggregateReportRequestMapper } from "../aggregate-report-request.mapper";
import { Subscription ,  Observer ,  Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { AggregateReportService } from "../aggregate-report.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AggregateReportFormOptions } from "../aggregate-report-form-options";
import { AggregateReportFormSettings } from "../aggregate-report-form-settings";
import { AssessmentDefinition } from "../assessment/assessment-definition";
import { AggregateReportOptions } from "../aggregate-report-options";
import { AggregateReportTable } from "../results/aggregate-report-table.component";
import { AggregateReportRequestSummary } from "../aggregate-report-summary.component";
import { AggregateReportTableDataService } from "../aggregate-report-table-data.service";
import { AggregateReportOptionsMapper } from "../aggregate-report-options.mapper";
import { EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { ScrollNavItem } from "../../shared/nav/scroll-nav.component";
import { AggregateReportColumnOrderItemProvider } from "../aggregate-report-column-order-item.provider";
import { OrderableItem } from "../../shared/order-selector/order-selector.component";
import { SubjectDefinition } from '../../subject/subject';
import { SubjectService } from '../../subject/subject.service';
import { Option } from '../../shared/form/option';

/**
 * Base query component implementation for all aggregate report types.
 */
export abstract class BaseAggregateQueryFormComponent implements OnInit, OnDestroy {

  @Input()
  submitAction: EventEmitter<Event>;

  @Output()
  navItemChange: EventEmitter<ScrollNavItem[]> = new EventEmitter(true);

  /**
   * Holds the server report options
   */
  aggregateReportOptions: AggregateReportOptions;

  /**
   * The current column order
   */
  columnItems: OrderableItem[];

  /**
   * Holds the form's filtered options
   */
  filteredOptions: AggregateReportFormOptions;

  /**
   * The preview table data
   */
  previewTable: AggregateReportTable;

  /**
   * Holds the form state
   */
  settings: AggregateReportFormSettings;

  /**
   * Handle on the request submission
   */
  submissionSubscription: Subscription;

  /**
   * The report request summary view
   */
  summary: AggregateReportRequestSummary;

  /**
   * Controls for view invalidation
   */
  reviewSectionInvalid: Observer<void>;
  reviewSectionViewInvalidator: Observable<void> = Observable.create(observer => this.reviewSectionInvalid = observer);

  previewSectionInvalid: Observer<void>;
  previewSectionViewInvalidator: Observable<void> = Observable.create(observer => this.previewSectionInvalid = observer);

  private _submitSubscription: Subscription;
  protected subjectDefinitions: SubjectDefinition[] = [];

  constructor(protected columnOrderableItemProvider: AggregateReportColumnOrderItemProvider,
              protected notificationService: NotificationService,
              protected optionMapper: AggregateReportOptionsMapper,
              protected reportService: AggregateReportService,
              protected subjectService: SubjectService,
              protected requestMapper: AggregateReportRequestMapper,
              protected route: ActivatedRoute,
              protected router: Router,
              protected tableDataService: AggregateReportTableDataService) {
    this.aggregateReportOptions = route.snapshot.data[ 'options' ];
    this.settings = Object.assign({}, route.snapshot.data[ 'settings' ]);
    const options: AggregateReportFormOptions = optionMapper.map(this.aggregateReportOptions);
    this.filteredOptions = Object.assign({}, options);
    this.setDefaultAssessmentType();
  }

  /**
   * Responsible for tracking form validity
   */
  abstract getFormGroup(): FormGroup;

  /**
   * Get the assessment definition
   */
  abstract getAssessmentDefinition(): AssessmentDefinition;

  /**
   * Get the subject definition
   */
  protected get subjectDefinition(): SubjectDefinition {
    return this.subjectDefinitions.find(x => x.subject == this.settings.subjects[0] && x.assessmentType == this.settings.assessmentType);
  }

  /**
   * Get the navigation items that can be scrolled to.
   */
  abstract getNavItems(): ScrollNavItem[];

  /**
   * Get the supported assessment types for this form
   */
  abstract getSupportedAssessmentTypes(): string[];

  ngOnInit(): void {
    this.navItemChange.emit(this.getNavItems());

    this.subjectService.getSubjectDefinitions().subscribe(subjectDefinitions => {
      this.subjectDefinitions = subjectDefinitions;

      this.updateSubjectsEnabled();
    });

    this._submitSubscription = this.submitAction.subscribe(() => {
      this.onGenerateButtonClick();
    });
  }

  ngOnDestroy(): void {
    this._submitSubscription.unsubscribe();
  }

  getControl(name: string): AbstractControl {
    return this.getFormGroup().contains(name) ? this.getFormGroup().get(name) : this.getFormGroup();
  }

  onColumnOrderChange(items: OrderableItem[]): void {
    this.settings.columnOrder = items.map(item => item.value);
  }

  /**
   * Creates a report if the form is valid
   */
  onGenerateButtonClick(): void {
    this.validate(this.getFormGroup(), () => {
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

  updateSubjectsEnabled(): void {
    const validSubjectDefinitions = this.subjectDefinitions.filter(x => x.assessmentType == this.settings.assessmentType);

    // disable subjects that don't have a definition for the assessment type
    let updatedOptions: Option[] = [];
    this.filteredOptions.subjects.forEach(option => {
      updatedOptions.push(
        Object.assign(option, {
          disabled: !validSubjectDefinitions.some(x => x.subject == option.value)
        })
      );
    });

    this.filteredOptions.subjects = updatedOptions;

    // remove any disabled ones from the subject selection
    const disabledOptions = updatedOptions.filter(x => x.disabled).map(x => x.value);
    this.settings.subjects = this.settings.subjects.filter(subject => !disabledOptions.includes(subject));
  }

  /**
   * @returns {boolean} true if the control has errors and has been touched or dirtied
   */
  showErrors(name?: string): boolean {
    return Forms.showErrors(this.getControl(name));
  }

  onReviewSectionInView(): void {
    // compute and render summary data
    this.summary = {
      assessmentDefinition: this.getAssessmentDefinition(),
      options: this.aggregateReportOptions,
      settings: this.settings
    };
  }

  onPreviewSectionInView(): void {
    // compute and render preview table
    this.previewTable = {
      assessmentDefinition: this.getAssessmentDefinition(),
      options: this.aggregateReportOptions,
      rows: this.tableDataService.createSampleData(
        this.getAssessmentDefinition(),
        this.subjectDefinition,
        this.settings,
        this.aggregateReportOptions
      ),
      reportType: this.settings.reportType
    };
  }

  /**
   * Reloads the report preview based on current form state
   */
  onSettingsChange(): void {
    if (this.reviewSectionInvalid) {
      this.reviewSectionInvalid.next(undefined);
    }
    if (this.previewSectionInvalid) {
      this.previewSectionInvalid.next(undefined);
    }
  }

  /**
   * Set the column order for the current assessment definition.
   * If the current column order contains exactly the elements of the assessment
   * definition's columns, return it unchanged.
   *
   * @returns {string[]} The new column order
   */
  protected getColumnOrderForAssessmentDefinition(): string[] {
    const targetColumns: string[] = this.getAssessmentDefinition().aggregateReportIdentityColumns;
    if (this.settings.columnOrder.length != targetColumns.length) {
      return targetColumns;
    }

    for (let column of this.settings.columnOrder) {
      if (targetColumns.indexOf(column) < 0) {
        return targetColumns;
      }
    }

    return this.settings.columnOrder;
  }

  protected setDefaultAssessmentType(): void {
    const supportedTypes: string[] = this.getSupportedAssessmentTypes();

    this.filteredOptions.assessmentTypes = this.filteredOptions.assessmentTypes
      .filter((type) => supportedTypes.includes(type.value));

    const allowedTypes: string[] = this.filteredOptions.assessmentTypes
      .map(option => option.value);

    this.settings.assessmentType = allowedTypes.includes(this.settings.assessmentType)
      ? this.settings.assessmentType
      : allowedTypes[0];
  }

  /**
   * Validates the given form group and marks the controls as dirty.
   * If the form is valid the onValid callback will be called
   * If the form is invalid the notifications will be displayed to the user
   *
   * @param {FormGroup} formGroup
   * @param {Function} onValid
   */
  protected validate(formGroup: FormGroup, onValid: () => void): void {

    // Mark form as dirty
    Forms.controls(this.getFormGroup())
      .forEach(control => control.markAsDirty());

    this.getFormGroup().updateValueAndValidity();

    if (formGroup.valid) {
      // Execute callback if the form is valid
      onValid();
    } else {
      // Notify user of all form errors to correct
      Forms.errors(this.getFormGroup()).forEach(error => {
        this.notificationService.error({ id: error.properties.messageId, args: error.properties.args });
      });
    }
  }

  /**
   * Creates an aggregate report request from the current
   * options, settings, and assessment definition.
   *
   * @returns {AggregateReportRequest} the created request
   */
  protected createReportRequest(): AggregateReportRequest {
    return this.requestMapper.map(this.filteredOptions, this.settings, this.getAssessmentDefinition());
  }

  protected updateColumnOrder(): void {
    this.settings.columnOrder = this.getColumnOrderForAssessmentDefinition();
    this.columnItems = this.columnOrderableItemProvider.toOrderableItems(this.settings.columnOrder);
  }
}
