import { BsModalRef } from 'ngx-bootstrap';
import { Component, EventEmitter, OnDestroy } from '@angular/core';
import { SandboxService } from '../sandbox.service';
import { SandboxConfiguration } from '../sandbox-configuration';

@Component({
  selector: 'archive-sandbox-modal',
  templateUrl: './archive-sandbox.modal.html'
})
export class ArchiveSandboxConfigurationModalComponent implements OnDestroy {
  sandbox: SandboxConfiguration;
  archived: EventEmitter<SandboxConfiguration> = new EventEmitter();

  constructor(private modal: BsModalRef, private service: SandboxService) {}

  cancel() {
    this.modal.hide();
  }

  archive() {
    //TODO: Implement this once backend A
    // this.service.archive(this.sandbox.code);
    this.modal.hide();
    this.archived.emit(this.sandbox);
  }

  ngOnDestroy(): void {
    this.archived.complete();
  }
}
