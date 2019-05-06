import { BsModalRef } from 'ngx-bootstrap';
import { Component, EventEmitter, OnDestroy } from '@angular/core';
import { SandboxService } from '../service/sandbox.service';
import { SandboxConfiguration } from '../model/sandbox-configuration';
import { TenantService } from '../service/tenant.service';
import { TenantConfiguration } from '../model/tenant-configuration';

@Component({
  selector: 'delete-tenant-modal',
  templateUrl: './delete-tenant.modal.html'
})
export class DeleteTenantConfigurationModalComponent implements OnDestroy {
  tenant: TenantConfiguration;
  deleted: EventEmitter<TenantConfiguration> = new EventEmitter();

  constructor(public modal: BsModalRef, private service: TenantService) {}

  cancel() {
    this.modal.hide();
  }

  delete() {
    this.service.delete(this.tenant.code);
    this.modal.hide();
    this.deleted.emit(this.tenant);
  }

  ngOnDestroy(): void {
    this.deleted.complete();
  }
}
