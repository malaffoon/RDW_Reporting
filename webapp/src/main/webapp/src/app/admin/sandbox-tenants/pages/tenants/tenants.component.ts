import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { TenantConfiguration } from '../../model/tenant-configuration';
import { TenantService } from '../../service/tenant.service';
import { DeleteTenantConfigurationModalComponent } from '../../modal/delete-tenant.modal';
import { RdwTranslateLoader } from '../../../../shared/i18n/rdw-translate-loader';
import { TenantStore } from '../../store/tenant.store';

@Component({
  selector: 'tenants',
  templateUrl: './tenants.component.html'
})
export class TenantsComponent implements OnInit {
  tenants$: Observable<TenantConfiguration[]>;
  localizationDefaults$: Observable<any>;
  private _modalSubscriptions: Subscription[] = [];

  constructor(
    private translationLoader: RdwTranslateLoader,
    private route: ActivatedRoute,
    private service: TenantService,
    private store: TenantStore,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.tenants$ = this.store.getState();
    this.service.getAll().subscribe(tenants => {
      this.store.setState(
        // TODO sort on backend
        tenants.sort((a, b) => a.label.localeCompare(b.label))
      );
    });

    // TODO: Get the correct language code from somewhere, do not hardcode
    this.localizationDefaults$ = this.translationLoader.getFlattenedTranslations(
      'en'
    );
  }

  openDeleteTenantModal(tenant: TenantConfiguration) {
    let modalReference: BsModalRef = this.modalService.show(
      DeleteTenantConfigurationModalComponent
    );
    let modal: DeleteTenantConfigurationModalComponent = modalReference.content;
    modal.tenant = tenant;
    this._modalSubscriptions.push(
      modal.deleted.subscribe(() => {
        this.store.setState(
          this.store.state.filter(({ code }) => code !== tenant.code)
        );
      })
    );
  }

  ngOnDestroy(): void {
    this._modalSubscriptions.forEach(subscription =>
      subscription.unsubscribe()
    );
    this._modalSubscriptions = [];
  }
}
