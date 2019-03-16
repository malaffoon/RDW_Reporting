import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnDestroy,
  Output
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormField, FormMapper } from '../../model/form';
import { finalize, map } from 'rxjs/operators';
import { forkJoin, of, Subject, Subscription } from 'rxjs';
import { ReportQuery, UserQuery, UserReport } from '../../report';
import { isEqualReportQuery } from '../../reports';
import {
  ServerReportQuery,
  UserReportService
} from '../../user-report.service';
import { NotificationService } from '../../../shared/notification/notification.service';
import { UserQueryService } from '../../user-query.service';
import {
  createFormGroup,
  ReportQueryMetadataByType
} from '../../model/report-forms';
import { Option } from '../../../shared/form/option';
import { isArray } from 'lodash';

/**
 * Represents all data needed to render the form
 */
export interface ReportForm {
  /**
   * The report query to load the form with
   */
  query: ReportQuery;

  /**
   * If present the form will associate the form state with an existing user query and present a save button
   */
  userQueryId?: number;

  /**
   * If set to true all fields will be readonly
   * If set to an array of strings only the specified field names will be readonly
   */
  readonly?: boolean | string[];

  /**
   * Option overrides useful for making the form context-aware
   */
  options?: { [fieldName: string]: Option[] };
}

/**
 * Form field view model
 */
interface FormFieldView extends FormField {
  readonly: boolean;
  readonlyValue?: any;
}

/**
 * The printable report form component
 */
@Component({
  selector: 'printable-report-form',
  templateUrl: './printable-report-form.component.html',
  styleUrls: ['./printable-report-form.component.less']
})
export class PrintableReportFormComponent implements OnDestroy {
  @Output()
  cancelled: EventEmitter<void> = new EventEmitter();

  @Output()
  userReportCreated: EventEmitter<UserReport> = new EventEmitter();

  @Output()
  userQueryCreated: EventEmitter<UserQuery> = new EventEmitter();

  @Output()
  userQueryUpdated: EventEmitter<UserQuery> = new EventEmitter();

  /**
   * The input form options
   */
  _form: ReportForm;

  /**
   * The initial query state used to see if there have been updates to the query
   */
  initialQuery: ReportQuery;

  /**
   * If true, the query will be saved when the create report button is clicked
   */
  saveQueryOnSubmit: boolean;

  /**
   * The form fields computed from the query
   */
  fields: FormFieldView[];

  /**
   * The form group computed from the query
   */
  formGroup: FormGroup;

  /**
   * Converts the form state to a query for submission
   */
  private _mapper: FormMapper;

  /**
   * Handle on async save query operation to disable inputs
   */
  private _saveQuerySubscription: Subscription;

  /**
   * Handle on async create report operation used to disable inputs
   */
  private _createReportSubscription: Subscription;

  /**
   * Used to clean up observable subscriptions
   */
  private _destroyed: Subject<void> = new Subject();

  constructor(
    private injector: Injector,
    private userQueryService: UserQueryService,
    private userReportService: UserReportService,
    private notificationService: NotificationService
  ) {}

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  @Input()
  set form(value: ReportForm) {
    this._form = value;
    this.updateForm();
  }

  get saveQueryCheckboxDisabled(): boolean {
    return this._createReportSubscription != null;
  }

  get saveQueryButtonDisabled(): boolean {
    return (
      this.formGroup.invalid ||
      this._saveQuerySubscription != null ||
      this._createReportSubscription != null ||
      isEqualReportQuery(this.initialQuery, this.createQuery())
    );
  }

  get createReportButtonDisabled(): boolean {
    return this.formGroup.invalid || this._createReportSubscription != null;
  }

  onCancelButtonClick(): void {
    this.cancelled.emit();
  }

  onSaveQueryButtonClick(): void {
    const userQuery = this.createUserQuery();
    this._saveQuerySubscription = this.userQueryService
      .updateQuery(userQuery)
      .pipe(
        finalize(() => {
          this._saveQuerySubscription = null;
        })
      )
      .subscribe(
        userQuery => {
          this.initialQuery = userQuery.query;
          this.userQueryUpdated.emit(userQuery);
        },
        () => {
          this.notificationService.error({
            id: 'user-query.action.save.error'
          });
        }
      );
  }

  onSubmit(): void {
    const query = this.createQuery();
    this._createReportSubscription = forkJoin(
      this.userReportService.createReport(<ServerReportQuery>query),
      this.saveQueryOnSubmit
        ? this.userQueryService.createQuery(query)
        : of(undefined)
    )
      .pipe(
        finalize(() => {
          this._createReportSubscription = null;
        })
      )
      .subscribe(
        ([userReport, userQuery]) => {
          this.notificationService.info({
            id: 'report-download.submitted-message',
            html: true
          });
          this.userReportCreated.emit(userReport);
          if (userQuery != null) {
            this.userQueryCreated.emit(userQuery);
          }
        },
        () => {
          this.notificationService.error({
            id: 'common.messages.submission-failed',
            html: true
          });
        }
      );
  }

  private createQuery(): ReportQuery {
    const { _form, _mapper, formGroup } = this;
    return {
      ..._form.query,
      ..._mapper.fromState(formGroup.value)
    };
  }

  private createUserQuery(): UserQuery {
    return {
      id: this._form.userQueryId,
      query: this.createQuery()
    };
  }

  private updateForm(): void {
    const {
      query,
      options: optionSettings = {},
      readonly: readonlySettings
    } = this._form;
    const { fields, mapper } = ReportQueryMetadataByType.get(query.type);
    const state = mapper.toState(query);
    forkJoin(fields.map(token => this.injector.get(token)))
      .pipe(
        map(fields =>
          fields
            // filter out conditionally excluded fields
            .filter(field => !field.excluded)
            .map(field => {
              // apply option overrides
              const options =
                optionSettings[field.name] != null
                  ? optionSettings[field.name]
                  : field.options;

              // compute readonly field
              const readonly =
                readonlySettings === true ||
                (readonlySettings != null &&
                  isArray(readonlySettings) &&
                  readonlySettings.includes(field.name));

              // compute readonly value
              const fieldValue =
                typeof state[field.name] !== 'undefined'
                  ? state[field.name]
                  : field.defaultValue;
              const readonlyValue =
                field.options != null
                  ? field.options.find(({ value }) => value === fieldValue).text
                  : fieldValue;

              return {
                ...field,
                options,
                readonly,
                readonlyValue
              };
            })
        )
      )
      .subscribe(fields => {
        this.fields = fields;
        this._mapper = mapper;
        this.formGroup = createFormGroup(fields, state, this._destroyed);
        this.initialQuery = this.createQuery();
      });
  }
}
