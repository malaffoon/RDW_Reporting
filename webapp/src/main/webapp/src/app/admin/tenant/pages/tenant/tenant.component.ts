import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, mergeMap, share, takeUntil } from 'rxjs/operators';
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

// TODO have diff checking to disable and enable the save button accordingly
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
    const sandboxDataSets$ = this.service.getSandboxDataSets().pipe(share());
    const tenants$ = this.service.getAll('TENANT').pipe(share());

    this.type$ = this.route.data.pipe(map(({ type }) => type));
    this.mode$ = this.route.data.pipe(map(({ mode }) => mode));

    this.tenants$ = this.type$.pipe(
      mergeMap(type => (type === 'SANDBOX' ? tenants$ : of([]))),
      share()
    );

    this.dataSets$ = this.type$.pipe(
      mergeMap(type => (type === 'SANDBOX' ? sandboxDataSets$ : of([]))),
      share()
    );

    this.configurationDefaults$ = this.type$.pipe(
      mergeMap(type => this.service.getDefaultConfigurationProperties(type)),
      share()
    );

    this.localizationDefaults$ = this.translationLoader
      .getFlattenedTranslations(this.languageStore.currentLanguage)
      .pipe(share());

    this.tenant$ = this.route.params.pipe(
      mergeMap(({ id }) =>
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
      ),
      share()
    );

    this.writable$ = this.userService
      .getUser()
      .pipe(map(({ permissions }) => permissions.includes('TENANT_WRITE')));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onCreate(value: TenantConfiguration): void {
    this.service.create(value).subscribe(
      () => {
        this.router.navigate(['..'], {
          relativeTo: this.route
        });
      },
      error => {
        try {
          this.notificationService.error({ id: error.json().message });
        } catch (exception) {
          this.notificationService.error({
            id: `tenant.create.error.${value.type}`
          });
        }
      }
    );
  }

  onUpdate(value: TenantConfiguration): void {
    this.service.update(value).subscribe(
      () => {},
      error => {
        try {
          this.notificationService.error({ id: error.json().message });
        } catch (exception) {
          this.notificationService.error({
            id: `tenant.update.error.${value.type}`
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
          this.router.navigate(['..'], {
            relativeTo: this.route
          });
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
