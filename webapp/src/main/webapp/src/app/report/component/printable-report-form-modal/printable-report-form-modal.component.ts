import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ReportForm } from '../printable-report-form/printable-report-form.component';
import { UserQuery, UserReport } from '../../report';

/**
 * Input options
 */
export interface ReportFormModalOptions {
  title: string;
  form: ReportForm;
}

/**
 * Simple modal wrapper around the printable report form
 */
@Component({
  selector: 'printable-report-form-modal',
  templateUrl: './printable-report-form-modal.component.html'
})
export class PrintableReportFormModalComponent {
  @Input()
  options: ReportFormModalOptions;

  @Output()
  cancelled: EventEmitter<void> = new EventEmitter();

  @Output()
  userReportCreated: EventEmitter<UserReport> = new EventEmitter();

  @Output()
  userQueryCreated: EventEmitter<UserQuery> = new EventEmitter();

  @Output()
  userQueryUpdated: EventEmitter<UserQuery> = new EventEmitter();

  constructor(private modalReference: BsModalRef) {}

  onCloseButtonClick(): void {
    this.modalReference.hide();
  }

  onCancelButtonClick(): void {
    this.modalReference.hide();
    this.cancelled.emit();
  }

  onUserReportCreated(userReport: UserReport): void {
    this.modalReference.hide();
    this.userReportCreated.emit(userReport);
  }

  onUserQueryCreated(userQuery: UserQuery): void {
    this.modalReference.hide();
    this.userQueryCreated.emit(userQuery);
  }

  onUserQueryUpdated(userQuery: UserQuery): void {
    this.modalReference.hide();
    this.userQueryUpdated.emit(userQuery);
  }
}
