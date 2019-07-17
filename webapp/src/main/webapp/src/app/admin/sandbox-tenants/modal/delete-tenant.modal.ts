import { BsModalRef } from 'ngx-bootstrap';
import { Component, EventEmitter, OnDestroy } from '@angular/core';
import { TenantConfiguration } from '../model/tenant-configuration';
import { NotificationService } from '../../../shared/notification/notification.service';
import { SandboxService } from '../service/sandbox.service';

@Component({
  selector: 'delete-tenant-modal',
  templateUrl: './delete-tenant.modal.html'
})
export class DeleteTenantConfigurationModalComponent implements OnDestroy {
  tenant: TenantConfiguration;
  deleted: EventEmitter<TenantConfiguration> = new EventEmitter();

  constructor(
    public modal: BsModalRef,
    private service: SandboxService,
    private notificationService: NotificationService
  ) {}

  cancel() {
    this.modal.hide();
  }

  delete() {
    this.service.delete(this.tenant.code).subscribe(
      () => {
        this.deleted.emit(this.tenant);
        this.notificationService.success({
          id: 'tenant-config.delete-modal.success'
        });
        this.modal.hide();
      },
      error => {
        this.notificationService.error({ id: 'tenant-config.errors.delete' });
        this.modal.hide();
      }
    );
  }

  ngOnDestroy(): void {
    this.deleted.complete();
  }
}
