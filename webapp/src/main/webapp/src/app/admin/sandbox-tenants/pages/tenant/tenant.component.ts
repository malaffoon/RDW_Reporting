import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { flatMap, map } from 'rxjs/operators';
import { TenantService } from '../../service/tenant.service';
import {
  DataSet,
  SandboxConfiguration
} from '../../model/sandbox-configuration';
import { forkJoin, Observable } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { UserService } from '../../../../shared/security/service/user.service';
import { LanguageStore } from '../../../../shared/i18n/language.store';
import { NotificationService } from '../../../../shared/notification/notification.service';
import { RdwTranslateLoader } from '../../../../shared/i18n/rdw-translate-loader';
import { ConfirmationModalComponent } from '../../../../shared/component/confirmation-modal/confirmation-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs/internal/observable/of';
import { FormMode } from '../../component/tenant-sandbox/tenant-sandbox.component';
import { TenantType } from '../../model/tenant-type';

@Component({
  selector: 'app-tenant',
  templateUrl: './tenant.component.html',
  styleUrls: ['./tenant.component.less']
})
export class TenantComponent {
  type$: Observable<TenantType>;
  mode$: Observable<FormMode>;
  tenant$: Observable<SandboxConfiguration>;
  tenants$: Observable<SandboxConfiguration[]>;
  dataSets$: Observable<DataSet[]>;
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
    private translationLoader: RdwTranslateLoader,
    private translateService: TranslateService
  ) {
    this.type$ = this.route.data.pipe(map(({ type }) => type));

    this.mode$ = this.route.data.pipe(map(({ mode }) => mode));

    this.tenant$ = this.route.params.pipe(
      flatMap(({ id }) => this.service.get(id))
    );

    this.localizationDefaults$ = this.translationLoader.getFlattenedTranslations(
      this.languageStore.currentLanguage
    );

    this.writable$ = this.userService
      .getUser()
      .pipe(map(({ permissions }) => permissions.includes('TENANT_WRITE')));

    this.tenants$ = this.type$.pipe(
      flatMap(type =>
        type === 'SANDBOX' ? this.service.getAll('TENANT') : of([])
      )
    );

    this.dataSets$ = this.type$.pipe(
      flatMap(type =>
        type === 'SANDBOX' ? this.service.getSandboxDataSets() : of([])
      )
    );

    // not working for some reason... may need to be combine latest?
    this.initialized$ = forkJoin(
      this.tenant$,
      this.localizationDefaults$,
      this.writable$
    ).pipe(map(() => true));
  }

  onDelete(tenant: SandboxConfiguration): void {
    const modalReference: BsModalRef = this.modalService.show(
      ConfirmationModalComponent
    );
    const modal: ConfirmationModalComponent = modalReference.content;

    modal.head = this.translateService.instant(
      'sandbox-config.delete-modal.header',
      tenant
    );
    modal.body = this.translateService.instant(
      'sandbox-config.delete-modal.body',
      tenant
    );
    modal.acceptButton = this.translateService.instant('common.action.delete');
    modal.acceptButtonClass = 'danger';
    modal.declineButton = this.translateService.instant('common.action.cancel');
    modal.accept.subscribe(() => {
      this.service.delete(tenant.code).subscribe(
        () => {
          this.notificationService.success({
            id: 'sandbox-config.delete-modal.success'
          });
          this.router.navigate(['..'], {
            relativeTo: this.route
          });
        },
        error => {
          this.notificationService.error({
            id: 'sandbox-config.errors.delete'
          });
        }
      );
    });
  }

  onSave(value: SandboxConfiguration): void {
    this.service.update(value).subscribe(
      () => {}, // TODO this used to reload from server
      error => {
        const errorMessage = error.json().message;
        errorMessage
          ? this.notificationService.error({ id: errorMessage })
          : this.notificationService.error({
              id: 'tenant-config.errors.update'
            });
      }
    );
  }
}
