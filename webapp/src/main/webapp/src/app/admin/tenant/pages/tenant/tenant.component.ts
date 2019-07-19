import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { flatMap, map, takeUntil } from 'rxjs/operators';
import { TenantService } from '../../service/tenant.service';
import { DataSet, TenantConfiguration } from '../../model/tenant-configuration';
import { Observable, Subject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { UserService } from '../../../../shared/security/service/user.service';
import { LanguageStore } from '../../../../shared/i18n/language.store';
import { NotificationService } from '../../../../shared/notification/notification.service';
import { RdwTranslateLoader } from '../../../../shared/i18n/rdw-translate-loader';
import { ConfirmationModalComponent } from '../../../../shared/component/confirmation-modal/confirmation-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs/internal/observable/of';
import { FormMode } from '../../component/tenant-form/tenant-form.component';
import { TenantType } from '../../model/tenant-type';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { defaultTenant } from '../../mapper/tenant.mapper';

@Component({
  selector: 'app-tenant',
  templateUrl: './tenant.component.html',
  styleUrls: ['./tenant.component.less']
})
export class TenantComponent implements OnDestroy {
  type$: Observable<TenantType>;
  mode$: Observable<FormMode>;
  tenant$: Observable<TenantConfiguration>;
  tenants$: Observable<TenantConfiguration[]>;
  dataSets$: Observable<DataSet[]>;
  configurationDefaults$: Observable<any>;
  localizationDefaults$: Observable<any>;
  writable$: Observable<boolean>;
  initialized$: Observable<boolean>;
  destroyed$: Subject<void> = new Subject();

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

    this.configurationDefaults$ = this.type$.pipe(
      flatMap(type => this.service.getDefaultConfigurationProperties(type))
    );

    this.localizationDefaults$ = this.translationLoader.getFlattenedTranslations(
      this.languageStore.currentLanguage
    );

    this.tenant$ = this.route.params.pipe(
      flatMap(({ id }) =>
        id != null
          ? this.service.get(id)
          : combineLatest(
              this.type$,
              this.tenants$,
              this.dataSets$,
              this.configurationDefaults$,
              this.localizationDefaults$
            ).pipe(
              takeUntil(this.destroyed$),
              map(
                ([
                  type,
                  [firstTenant],
                  [firstDataSet],
                  configurationProperties,
                  localizationOverrides
                ]) =>
                  defaultTenant(
                    type,
                    configurationProperties,
                    localizationOverrides,
                    firstTenant,
                    firstDataSet
                  )
              )
            )
      )
    );

    this.writable$ = this.userService
      .getUser()
      .pipe(map(({ permissions }) => permissions.includes('TENANT_WRITE')));

    this.initialized$ = combineLatest(
      this.type$,
      this.mode$,
      this.tenants$,
      this.dataSets$,
      this.configurationDefaults$,
      this.localizationDefaults$,
      this.tenant$,
      this.writable$
    ).pipe(
      takeUntil(this.destroyed$),
      map(() => true)
    );
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onCreate(value: TenantConfiguration): void {
    this.service.create(value).subscribe(
      () => {}, // TODO this used to reload from server
      error => {
        try {
          this.notificationService.error({ id: error.json().message });
        } catch (exception) {
          this.notificationService.error({
            id: 'tenant-config.errors.create'
          });
        }
      }
    );
  }

  onUpdate(value: TenantConfiguration): void {
    this.service.update(value).subscribe(
      () => {}, // TODO this used to reload from server
      error => {
        try {
          this.notificationService.error({ id: error.json().message });
        } catch (exception) {
          this.notificationService.error({
            id: 'tenant-config.errors.update'
          });
        }
      }
    );
  }

  onDelete(tenant: TenantConfiguration): void {
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
    modal.acceptButtonClass = 'btn-danger';
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
}
