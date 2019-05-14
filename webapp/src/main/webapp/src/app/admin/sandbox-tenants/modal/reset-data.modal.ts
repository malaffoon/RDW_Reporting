import { BsModalRef } from 'ngx-bootstrap';
import { Component, EventEmitter, OnDestroy } from '@angular/core';
import { SandboxService } from '../service/sandbox.service';
import { SandboxConfiguration } from '../model/sandbox-configuration';

@Component({
  selector: 'reset-data-modal',
  templateUrl: './reset-data.modal.html'
})
export class ResetDataModalComponent implements OnDestroy {
  sandbox: SandboxConfiguration;
  resetData: EventEmitter<SandboxConfiguration> = new EventEmitter();

  constructor(public modal: BsModalRef, private service: SandboxService) {}

  cancel() {
    this.modal.hide();
  }

  reset() {
    this.service.resetData(this.sandbox.code);
    this.modal.hide();
    this.resetData.emit(this.sandbox);
  }

  ngOnDestroy(): void {
    this.resetData.complete();
  }
}