import { BsModalRef } from 'ngx-bootstrap';
import { Component, EventEmitter, OnDestroy } from '@angular/core';
import { SandboxService } from '../sandbox.service';
import { SandboxConfiguration } from '../sandbox-configuration';

@Component({
  selector: 'delete-sandbox-modal',
  templateUrl: './delete-sandbox.modal.html'
})
export class DeleteSandboxConfigurationModalComponent implements OnDestroy {
  sandbox: SandboxConfiguration;
  deleted: EventEmitter<SandboxConfiguration> = new EventEmitter();

  constructor(private modal: BsModalRef, private service: SandboxService) {}

  cancel() {
    this.modal.hide();
  }

  delete() {
    this.service.delete(this.sandbox.code);
    this.modal.hide();
    this.deleted.emit(this.sandbox);
  }

  ngOnDestroy(): void {
    this.deleted.complete();
  }
}
