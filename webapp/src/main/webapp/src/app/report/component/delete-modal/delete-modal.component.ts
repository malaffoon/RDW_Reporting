import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

/**
 * Simple modal wrapper around the printable report form
 */
@Component({
  selector: 'delete-modal',
  templateUrl: './delete-modal.component.html'
})
export class DeleteModalComponent {
  @Input()
  name: string;

  @Input()
  messageId: string = 'delete-modal.body';

  @Output()
  deleted: EventEmitter<void> = new EventEmitter();

  constructor(private modalReference: BsModalRef) {}

  onCloseButtonClick(): void {
    this.close();
  }

  onCancelButtonClick(): void {
    this.close();
  }

  onDeleteButtonClick(): void {
    this.close();
    this.deleted.emit();
  }

  private close(): void {
    this.deleted.complete();
    this.modalReference.hide();
  }
}
