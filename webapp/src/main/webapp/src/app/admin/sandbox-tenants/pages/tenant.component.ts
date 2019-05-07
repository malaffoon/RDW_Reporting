import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { TenantConfiguration } from '../model/tenant-configuration';
import { TenantService } from '../service/tenant.service';
import { DeleteTenantConfigurationModalComponent } from '../modal/delete-tenant.modal';

@Component({
  selector: 'tenant-config',
  templateUrl: './tenant.component.html'
})
export class TenantConfigurationComponent {
  tenants: TenantConfiguration[];

  private _modalSubscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private service: TenantService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.service.getAll().subscribe(tenants => (this.tenants = tenants));
  }

  openDeleteTenantModal(tenant: TenantConfiguration) {
    let modalReference: BsModalRef = this.modalService.show(
      DeleteTenantConfigurationModalComponent
    );
    let modal: DeleteTenantConfigurationModalComponent = modalReference.content;
    modal.tenant = tenant;
    this._modalSubscriptions.push(
      modal.deleted.subscribe(tenant => {
        console.log(tenant);
      })
    );
  }

  unsubscribe() {
    this._modalSubscriptions.forEach(subscription =>
      subscription.unsubscribe()
    );
    this._modalSubscriptions = [];
  }
}
