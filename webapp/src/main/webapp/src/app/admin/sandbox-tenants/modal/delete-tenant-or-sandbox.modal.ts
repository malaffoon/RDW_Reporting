import { BsModalRef } from 'ngx-bootstrap';
import { Component, EventEmitter, OnDestroy } from '@angular/core';
import { SandboxService } from '../service/sandbox.service';
import { SandboxConfiguration } from '../model/sandbox-configuration';

@Component({
  selector: 'delete-tenan-or-sandbox-modal',
  templateUrl: './delete-tenant-or-sandbox.modal.html'
})
export class DeleteTenantOrSandboxConfigurationModalComponent
  implements OnDestroy {
  sandboxOrTenant: any;
  deleted: EventEmitter<any> = new EventEmitter();

  constructor(public modal: BsModalRef, private service: SandboxService) {}

  cancel() {
    this.modal.hide();
  }

  delete() {
    this.service.delete(this.sandboxOrTenant.code);
    this.modal.hide();
    this.deleted.emit(this.sandboxOrTenant);
  }

  ngOnDestroy(): void {
    this.deleted.complete();
  }
}
