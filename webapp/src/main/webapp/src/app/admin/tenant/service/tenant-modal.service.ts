import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ConfirmationModalComponent } from '../../../shared/component/confirmation-modal/confirmation-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { TenantConfiguration } from '../model/tenant-configuration';
import { Router } from '@angular/router';
import { NotificationService } from '../../../shared/notification/notification.service';
import { TenantService } from './tenant.service';

@Injectable({
  providedIn: 'root'
})
export class TenantModalService {
  constructor(
    private modalService: BsModalService,
    private translateService: TranslateService,
    private notificationService: NotificationService,
    private service: TenantService,
    private router: Router
  ) {}

  openDeleteConfirmationModal(tenant: TenantConfiguration): void {
    const modalReference: BsModalRef = this.modalService.show(
      ConfirmationModalComponent
    );
    const modal: ConfirmationModalComponent = modalReference.content;

    modal.head = this.translateService.instant(
      'tenant.delete.modal.head',
      tenant
    );
    modal.body = this.translateService.instant(
      'tenant.delete.modal.body',
      tenant
    );
    modal.acceptButton = this.translateService.instant('common.action.delete');
    modal.acceptButtonClass = 'btn-danger';
    modal.declineButton = this.translateService.instant('common.action.cancel');
    modal.accept.subscribe(() => {
      this.service.delete(tenant.code).subscribe(
        () => {
          this.notificationService.success({
            id: 'tenant.delete.success'
          });
          this.router.navigateByUrl(
            tenant.type === 'TENANT' ? '/tenants' : '/sandboxes'
          );
        },
        error => {
          this.notificationService.error({
            id: 'tenant.delete.error'
          });
        }
      );
    });
  }
}
