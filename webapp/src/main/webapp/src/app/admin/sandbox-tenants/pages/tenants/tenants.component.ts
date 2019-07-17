import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Observable } from 'rxjs';
import { TenantConfiguration } from '../../model/tenant-configuration';
import { DeleteTenantConfigurationModalComponent } from '../../modal/delete-tenant.modal';
import { RdwTranslateLoader } from '../../../../shared/i18n/rdw-translate-loader';
import { TenantStore } from '../../store/tenant.store';
import { LanguageStore } from '../../../../shared/i18n/language.store';
import { map } from 'rxjs/operators';
import { NotificationService } from '../../../../shared/notification/notification.service';
import { UserService } from '../../../../shared/security/service/user.service';
import { SandboxService } from '../../service/sandbox.service';
import { SandboxConfiguration } from '../../model/sandbox-configuration';

@Component({
  selector: 'tenants',
  templateUrl: './tenants.component.html'
})
export class TenantsComponent implements OnInit {
  tenants$: Observable<TenantConfiguration[]>;
  localizationDefaults$: Observable<any>;
  writable$: Observable<boolean>;

  constructor(
    private translationLoader: RdwTranslateLoader,
    private route: ActivatedRoute,
    private service: SandboxService,
    private store: TenantStore,
    private userService: UserService,
    private languageStore: LanguageStore,
    private modalService: BsModalService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.tenants$ = this.store.getState();
    this.loadTenants();

    this.localizationDefaults$ = this.translationLoader.getFlattenedTranslations(
      this.languageStore.currentLanguage
    );

    this.writable$ = this.userService
      .getUser()
      .pipe(map(({ permissions }) => permissions.includes('TENANT_WRITE')));
  }

  onDelete(tenant: TenantConfiguration): void {
    const modalReference: BsModalRef = this.modalService.show(
      DeleteTenantConfigurationModalComponent
    );
    const modal: DeleteTenantConfigurationModalComponent =
      modalReference.content;
    modal.tenant = tenant;
    modal.deleted.subscribe(() => {
      this.store.setState(
        this.store.state.filter(({ code }) => code !== tenant.code)
      );
    });
  }

  onSave(value: SandboxConfiguration): void {
    this.service.update(value).subscribe(
      () => this.loadTenants(),
      error =>
        error.json().message
          ? this.notificationService.error({ id: error.json().message })
          : this.notificationService.error({
              id: 'tenant-config.errors.update'
            })
    );
  }

  private loadTenants() {
    this.service.getAll('TENANT').subscribe(tenants => {
      this.store.setState(
        tenants.sort((a, b) => a.label.localeCompare(b.label))
      );
    });
  }
}
