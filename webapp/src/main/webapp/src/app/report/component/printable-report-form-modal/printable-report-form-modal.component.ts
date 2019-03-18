import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnDestroy,
  Output
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ReportQuery, UserQuery, UserReport } from '../../report';
import {
  Destroyable,
  FormFieldView,
  FormMapper,
  FormOptions
} from '../../../shared/form/form';
import { FormGroup } from '@angular/forms';
import { forkJoin, of, Subscription } from 'rxjs';
import { isEqualReportQuery } from '../../reports';
import { finalize, map } from 'rxjs/operators';
import {
  ServerReportQuery,
  UserReportService
} from '../../user-report.service';
import { ReportQueryMetadataByType } from '../../model/report-forms';
import {
  createReactiveFormGroup,
  toFormFieldViews
} from '../../../shared/form/forms';
import { UserQueryService } from '../../user-query.service';
import { NotificationService } from '../../../shared/notification/notification.service';

/**
 * Input options
 */
export interface ReportFormModalOptions extends FormOptions {
  /**
   * The modal title
   */
  title: string;

  /**
   * The report query to load the form with
   */
  query: ReportQuery;

  /**
   * If present the form will associate the form state with an existing user query and present a save button
   */
  userQueryId?: number;
}

/**
 * Simple modal wrapper around the printable report form
 */
@Component({
  selector: 'printable-report-form-modal',
  templateUrl: './printable-report-form-modal.component.html',
  styleUrls: ['./printable-report-form-modal.component.less']
})
export class PrintableReportFormModalComponent implements OnDestroy {
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
  _options: ReportFormModalOptions;

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
  reactiveFormGroup: Destroyable<FormGroup>;

  /**
   * True when the component is ready to render
   */
  initialized: boolean;

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

  constructor(
    private injector: Injector,
    private userQueryService: UserQueryService,
    private userReportService: UserReportService,
    private notificationService: NotificationService,
    private modalReference: BsModalRef
  ) {}

  ngOnDestroy(): void {
    this.reactiveFormGroup.destroy();
  }

  @Input()
  set options(value: ReportFormModalOptions) {
    this._options = value;
    this.updateForm();
  }

  get formGroup(): FormGroup {
    return this.reactiveFormGroup.value;
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

  onCloseButtonClick(): void {
    this.modalReference.hide();
  }

  onCancelButtonClick(): void {
    this.modalReference.hide();
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
          this.modalReference.hide();
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
          this.modalReference.hide();
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
    const { _options, _mapper, formGroup } = this;
    return {
      ..._options.query,
      ..._mapper.fromState(formGroup.value)
    };
  }

  private createUserQuery(): UserQuery {
    return {
      id: this._options.userQueryId,
      query: this.createQuery()
    };
  }

  private updateForm(): void {
    const { query } = this._options;
    const { fields, mapper } = ReportQueryMetadataByType.get(query.type);
    const state = mapper.toState(query);
    forkJoin(fields.map(token => this.injector.get(token)))
      .pipe(map(fields => toFormFieldViews(fields, state, this._options)))
      .subscribe(fields => {
        this.fields = fields;
        this._mapper = mapper;

        const controls = fields.reduce((controls, view) => {
          controls[view.name] = view.control;
          return controls;
        }, {});

        this.reactiveFormGroup = createReactiveFormGroup(fields, controls);
        this.initialQuery = this.createQuery();
        this.initialized = true;
      });
  }
}
