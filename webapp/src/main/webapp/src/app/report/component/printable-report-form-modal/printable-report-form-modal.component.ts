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
import { forkJoin, Subscription } from 'rxjs';
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
   * Handle on async create/update query operation to disable inputs
   */
  private _userQuerySubscription: Subscription;

  /**
   * Handle on async create report operation used to disable inputs
   */
  private _userReportSubscription: Subscription;

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

  get createQueryButtonDisabled(): boolean {
    return (
      this.formGroup.invalid ||
      this._userQuerySubscription != null ||
      this._userReportSubscription != null
    );
  }

  get updateQueryButtonDisabled(): boolean {
    return (
      this.createQueryButtonDisabled ||
      isEqualReportQuery(this.initialQuery, this.createQuery())
    );
  }

  get createReportButtonDisabled(): boolean {
    return this.formGroup.invalid || this._userReportSubscription != null;
  }

  onCloseButtonClick(): void {
    this.close();
  }

  onCancelButtonClick(): void {
    this.cancelled.emit();
    this.close();
  }

  onCreateQueryButtonClick(): void {
    const query = this.createQuery();
    this._userQuerySubscription = this.userQueryService
      .createQuery(query)
      .pipe(
        finalize(() => {
          this._userQuerySubscription = null;
        })
      )
      .subscribe(
        userQuery => {
          this._options.userQueryId = userQuery.id;
          this.initialQuery = userQuery.query;
          this.userQueryCreated.emit(userQuery);
          this.notificationService.info({
            id: 'user-query.action.create.success',
            html: true
          });
        },
        () => {
          this.notificationService.error({
            id: 'user-query.action.create.error'
          });
        }
      );
  }

  onUpdateQueryButtonClick(): void {
    const userQuery = this.createUserQuery();
    this._userQuerySubscription = this.userQueryService
      .updateQuery(userQuery)
      .pipe(
        finalize(() => {
          this._userQuerySubscription = null;
        })
      )
      .subscribe(
        userQuery => {
          this.initialQuery = userQuery.query;
          this.userQueryUpdated.emit(userQuery);
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

  onSubmit(): void {
    const query = this.createQuery();
    this._userReportSubscription = this.userReportService
      .createReport(<ServerReportQuery>query)
      .pipe(
        finalize(() => {
          this._userReportSubscription = null;
        })
      )
      .subscribe(
        userReport => {
          this.notificationService.info({
            id: 'report-download.submitted-message',
            html: true
          });
          this.userReportCreated.emit(userReport);
          this.close();
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
        if (this._options.userQueryId != null) {
          this.initialQuery = this.createQuery();
        }
        this.initialized = true;
      });
  }

  private close(): void {
    // end streams so subscribers are released
    this.cancelled.complete();
    this.userReportCreated.complete();
    this.userQueryCreated.complete();
    this.userQueryUpdated.complete();
    this.modalReference.hide();
  }
}
