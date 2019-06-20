import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html'
})
export class ConfirmationModalComponent {
  @Input()
  head: string;

  @Input()
  body: string;

  @Input()
  acceptButton: string;

  @Input()
  acceptButtonClass: any = 'btn-primary';

  @Input()
  declineButton: string;

  @Input()
  declineButtonClass: any = 'btn-default';

  @Output()
  accept: EventEmitter<void> = new EventEmitter();

  constructor(private modalReference: BsModalRef) {}

  onCloseButtonClick(): void {
    this.close();
  }

  onDeclineButtonClick(): void {
    this.close();
  }

  onAcceptButtonClick(): void {
    this.accept.emit();
    this.close();
  }

  private close(): void {
    this.accept.complete();
    this.modalReference.hide();
  }
}
