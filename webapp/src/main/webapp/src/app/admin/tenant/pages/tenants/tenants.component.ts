import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  Subject,
  timer
} from 'rxjs';
import { TenantService } from '../../service/tenant.service';
import { TenantConfiguration } from '../../model/tenant-configuration';
import { filter, flatMap, map, takeUntil } from 'rxjs/operators';
import { TenantType } from '../../model/tenant-type';
import { tap } from 'rxjs/internal/operators/tap';
import { ordering } from '@kourge/ordering';
import { byString, join } from '@kourge/ordering/comparator';
import { completedTenantStatuses } from '../../model/tenant-statuses';
import { TenantModalService } from '../../service/tenant-modal.service';

const pollingInterval = 1000;

const byKey = ordering(byString).on(({ code: key }) => key).compare;

@Component({
  selector: 'tenants',
  templateUrl: './tenants.component.html'
})
export class TenantsComponent implements OnDestroy {
  tenantType$: Observable<TenantType>;
  tenants$: Observable<TenantConfiguration[]>;
  destroyed$: Subject<void> = new Subject<void>();
  polling$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  pollingCompleted$: Subject<void> = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: TenantService,
    private modalService: TenantModalService
  ) {
    this.tenantType$ = this.route.data.pipe(map(({ type }) => type));

    // TODO we should really only ping for status updates - not the entire tenant data
    this.tenants$ = combineLatest(
      this.tenantType$,
      timer(0, pollingInterval)
    ).pipe(
      takeUntil(this.destroyed$),
      takeUntil(this.pollingCompleted$),
      // don't query the server unless the previous request is complete
      filter(() => !this.polling$.value),
      tap(() => {
        this.polling$.next(true);
      }),
      flatMap(([type]) =>
        this.service.getAll(type).pipe(
          map(tenants => tenants.slice().sort(byKey)),
          // would like a less side-effecty way to do this but it works at least
          tap(tenants => {
            if (
              tenants.every(({ status }) =>
                completedTenantStatuses.includes(status)
              )
            ) {
              this.pollingCompleted$.next();
              this.pollingCompleted$.complete();
            }
            this.polling$.next(false);
          })
        )
      )
    );
  }

  onTenantClick(tenant: TenantConfiguration): void {
    this.router.navigate(['.', tenant.code], {
      relativeTo: this.route
    });
  }

  onTenantDeleteButtonClick(tenant: TenantConfiguration): void {
    this.modalService.openDeleteConfirmationModal(tenant);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
