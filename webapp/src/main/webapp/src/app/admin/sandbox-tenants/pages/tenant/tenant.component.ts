import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { flatMap, map } from 'rxjs/operators';
import { TenantService } from '../../service/tenant.service';
import { SandboxConfiguration } from '../../model/sandbox-configuration';
import { forkJoin, Observable } from 'rxjs';
import { DeleteTenantConfigurationModalComponent } from '../../modal/delete-tenant.modal';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { UserService } from '../../../../shared/security/service/user.service';
import { LanguageStore } from '../../../../shared/i18n/language.store';
import { NotificationService } from '../../../../shared/notification/notification.service';
import { RdwTranslateLoader } from '../../../../shared/i18n/rdw-translate-loader';

@Component({
  selector: 'app-tenant',
  templateUrl: './tenant.component.html',
  styleUrls: ['./tenant.component.less']
})
export class TenantComponent {
  tenant$: Observable<SandboxConfiguration>;
  localizationDefaults$: Observable<any>;
  writable$: Observable<boolean>;
  initialized$: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: TenantService,
    private userService: UserService,
    private languageStore: LanguageStore,
    private modalService: BsModalService,
    private notificationService: NotificationService,
    private translationLoader: RdwTranslateLoader
  ) {
    this.tenant$ = this.route.params.pipe(
      flatMap(({ id }) => this.service.get(id))
    );

    this.localizationDefaults$ = this.translationLoader.getFlattenedTranslations(
      this.languageStore.currentLanguage
    );

    this.writable$ = this.userService
      .getUser()
      .pipe(map(({ permissions }) => permissions.includes('TENANT_WRITE')));

    // this.initialized$ = forkJoin(
    //   this.tenant$,
    //   this.localizationDefaults$,
    //   this.writable$
    // ).pipe(
    //   map(() => true)
    // );
  }

  onDelete(tenant: SandboxConfiguration): void {
    const modalReference: BsModalRef = this.modalService.show(
      DeleteTenantConfigurationModalComponent
    );
    const modal: DeleteTenantConfigurationModalComponent =
      modalReference.content;
    modal.tenant = tenant;
    modal.deleted.subscribe(() => {
      this.router.navigate(['..'], {
        relativeTo: this.route
      });
    });
  }

  onSave(value: SandboxConfiguration): void {
    this.service.update(value).subscribe(
      () => {}, // TODO this used to reload from server
      error =>
        error.json().message
          ? this.notificationService.error({ id: error.json().message })
          : this.notificationService.error({
              id: 'tenant-config.errors.update'
            })
    );
  }
}
