import { AbstractControl, FormGroup } from '@angular/forms';
import { Forms } from '../../shared/form/forms';
import { NotificationService } from '../../shared/notification/notification.service';
import { AggregateReportRequestMapper } from '../aggregate-report-request.mapper';
import { forkJoin, Observable, Observer, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AggregateReportService } from '../aggregate-report.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AggregateReportFormOptions } from '../aggregate-report-form-options';
import { AggregateReportFormSettings } from '../aggregate-report-form-settings';
import { AssessmentDefinition } from '../assessment/assessment-definition';
import { AggregateReportOptions } from '../aggregate-report-options';
import { AggregateReportRequestSummary } from '../aggregate-report-summary.component';
import { AggregateReportTableDataService } from '../aggregate-report-table-data.service';
import { AggregateReportOptionsMapper } from '../aggregate-report-options.mapper';
import { OnDestroy, OnInit } from '@angular/core';
import { ScrollNavItem } from '../../shared/nav/scroll-nav.component';
import { AggregateReportColumnOrderItemProvider } from '../aggregate-report-column-order-item.provider';
import { OrderableItem } from '../../shared/order-selector/order-selector.component';
import { SubjectDefinition } from '../../subject/subject';
import { SubjectService } from '../../subject/subject.service';
import { Option } from '../../shared/form/option';
import { AggregateReportItem } from '../results/aggregate-report-item';
import {
  AggregateReportQueryType,
  ReportQueryType,
  UserQuery
} from '../../report/report';
import { UserQueryService } from '../../report/user-query.service';
import { isEqualReportQuery } from '../../report/reports';
import { Utils } from '../../shared/support/support';

/**
 * Base query component implementation for all aggregate report types.
 */
export abstract class BaseAggregateQueryFormComponent
  implements OnInit, OnDestroy {
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
   * Holds the form's original options
   */
  originalOptions: AggregateReportFormOptions;

  /**
   * The preview table data
   */
  previewTableRows: AggregateReportItem[];

  /**
   * Holds the form state
   */
  settings: AggregateReportFormSettings;

  /**
   * Handle on the request submission
   */
  userReportSubscription: Subscription;
  userQuerySubscription: Subscription;

  /**
   * The report request summary view
   */
  summary: AggregateReportRequestSummary;

  /**
   * Controls for view invalidation
   */
  reviewSectionInvalid: Observer<void>;
  reviewSectionViewInvalidator: Observable<void> = Observable.create(
    observer => (this.reviewSectionInvalid = observer)
  );

  previewSectionInvalid: Observer<void>;
  previewSectionViewInvalidator: Observable<void> = Observable.create(
    observer => (this.previewSectionInvalid = observer)
  );

  protected subjectDefinitions: SubjectDefinition[] = [];

  initialQuery: AggregateReportQueryType;

  protected constructor(
    protected columnOrderableItemProvider: AggregateReportColumnOrderItemProvider,
    protected notificationService: NotificationService,
    protected optionMapper: AggregateReportOptionsMapper,
    protected reportService: AggregateReportService,
    protected userQueryService: UserQueryService,
    protected subjectService: SubjectService,
    protected requestMapper: AggregateReportRequestMapper,
    protected route: ActivatedRoute,
    protected router: Router,
    protected tableDataService: AggregateReportTableDataService
  ) {
    const { options } = route.snapshot.data;
    this.aggregateReportOptions = options;
    this.originalOptions = optionMapper.map(this.aggregateReportOptions);
    this.filteredOptions = { ...this.originalOptions };
  }

  abstract initialize(): void;

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
  get subjectDefinition(): SubjectDefinition {
    const { settings } = this;
    return this.subjectDefinitions.find(
      x =>
        x.subject == settings.subjects[0].code &&
        x.assessmentType == settings.assessmentType
    );
  }

  abstract getReportType(): ReportQueryType;

  /**
   * Get the navigation items that can be scrolled to.
   */
  abstract getNavItems(): ScrollNavItem[];

  /**
   * Get the supported assessment types for this form
   */
  abstract getSupportedAssessmentTypes(): string[];

  ngOnInit(): void {
    const { query, options } = this.route.snapshot.data;
    const { userQueryId, userReportId } = this.route.snapshot.queryParams;
    forkJoin(
      this.subjectService.getSubjectDefinitions(),
      query != null
        ? this.requestMapper.toSettings(query, options)
        : this.optionMapper.toDefaultSettings(options)
    ).subscribe(([subjectDefinitions, settings]) => {
      this.subjectDefinitions = subjectDefinitions;
      this.settings =
        userReportId != null
          ? {
              ...settings,
              name: Utils.appendOrIncrementFileNameSuffix(query.name)
            }
          : settings;

      this.updateSubjectsEnabled();
      this.setDefaultAssessmentType();
      this.initialize();
      if (userQueryId != null) {
        this.initialQuery = {
          ...this.createReportRequest(),
          type: query.type
        };
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userQuerySubscription != null) {
      this.userQuerySubscription.unsubscribe();
    }
    if (this.userReportSubscription != null) {
      this.userReportSubscription.unsubscribe();
    }
  }

  get saveQueryButtonDisabled(): boolean {
    return (
      this.getFormGroup().invalid ||
      this.userReportSubscription != null ||
      this.userQuerySubscription != null ||
      isEqualReportQuery(this.initialQuery, this.createReportRequest())
    );
  }

  get saveQueryCheckboxDisabled(): boolean {
    return this.userReportSubscription != null;
  }

  getControl(name: string): AbstractControl {
    return this.getFormGroup().contains(name)
      ? this.getFormGroup().get(name)
      : this.getFormGroup();
  }

  onColumnOrderChange(items: OrderableItem[]): void {
    this.settings.columnOrder = items.map(item => item.value);
  }

  onSaveQueryButtonClick(): void {
    const userQuery = this.createUserQuery();
    this.userQuerySubscription = this.userQueryService
      .updateQuery(userQuery)
      .pipe(
        finalize(() => {
          this.userQuerySubscription = null;
        })
      )
      .subscribe(
        () => {
          this.initialQuery = <AggregateReportQueryType>userQuery.query;
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

  /**
   * Creates a report if the form is valid
   */
  onGenerateButtonClick(): void {
    const { userQueryId } = this.route.snapshot.queryParams;
    this.validate(this.getFormGroup(), () => {
      const query = this.createReportRequest();
      this.userReportSubscription = this.reportService
        .createReport(query)
        .pipe(
          finalize(() => {
            this.userReportSubscription.unsubscribe();
            this.userReportSubscription = undefined;
          })
        )
        .subscribe(
          userReport => {
            this.router.navigate([userReport.id], {
              relativeTo: this.route,
              preserveQueryParams: true
            });
          },
          () => {
            this.notificationService.error({
              id: 'common.messages.submission-failed',
              html: true
            });
          }
        );
    });
  }

  updateSubjectsEnabled(): void {
    const { settings, filteredOptions, originalOptions } = this;

    // disable subjects that don't have a definition for the assessment type
    // for target report, hide subjects that have the target_report flag set to false
    const options: Option[] = originalOptions.subjects.filter(
      option =>
        option.value.assessmentType === settings.assessmentType &&
        (settings.reportType !== 'Target' || option.value.targetReport)
    );

    filteredOptions.subjects = options;

    // remove any disabled ones from the subject selection
    // TODO this assigns the correct value but still it is not reflected after changing to and from assessment types
    const enabledOptions = options.map(x => x.value);
    settings.subjects = enabledOptions.filter(value =>
      settings.subjects.find(({ code }) => code === value.code)
    );
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
    this.previewTableRows = this.tableDataService.createSampleData(
      this.getAssessmentDefinition(),
      this.subjectDefinition,
      this.settings,
      this.aggregateReportOptions
    );
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
    const targetColumns: string[] = this.getAssessmentDefinition()
      .aggregateReportIdentityColumns;
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

    this.filteredOptions.assessmentTypes = this.filteredOptions.assessmentTypes.filter(
      type => supportedTypes.includes(type.value)
    );

    const allowedTypes: string[] = this.filteredOptions.assessmentTypes.map(
      option => option.value
    );

    this.settings.assessmentType = allowedTypes.includes(
      this.settings.assessmentType
    )
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
    Forms.controls(this.getFormGroup()).forEach(control =>
      control.markAsDirty()
    );

    this.getFormGroup().updateValueAndValidity();

    if (formGroup.valid) {
      // Execute callback if the form is valid
      onValid();
    } else {
      // Notify user of all form errors to correct
      Forms.errors(this.getFormGroup()).forEach(error => {
        this.notificationService.error({
          id: error.properties.messageId,
          args: error.properties.args
        });
      });
    }
  }

  /**
   * Creates an aggregate report request from the current
   * options, settings, and assessment definition.
   */
  protected createReportRequest(): AggregateReportQueryType {
    return this.requestMapper.map(
      this.filteredOptions,
      this.settings,
      this.subjectDefinition,
      this.getAssessmentDefinition()
    );
  }

  private createUserQuery(): UserQuery {
    return {
      id: this.route.snapshot.queryParams.userQueryId,
      query: this.createReportRequest()
    };
  }

  protected updateColumnOrder(): void {
    this.settings.columnOrder = this.getColumnOrderForAssessmentDefinition();
    this.columnItems = this.columnOrderableItemProvider.toOrderableItems(
      this.settings.columnOrder
    );
  }
}
