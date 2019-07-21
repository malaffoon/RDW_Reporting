import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable, Subject, timer } from 'rxjs';
import { TenantService } from '../../service/tenant.service';
import { TenantConfiguration } from '../../model/tenant-configuration';
import { flatMap, map, takeUntil } from 'rxjs/operators';
import { TenantType } from '../../model/tenant-type';
import { tap } from 'rxjs/internal/operators/tap';
import { ordering } from '@kourge/ordering';
import { byString } from '@kourge/ordering/comparator';
import { completedTenantStatuses } from '../../model/tenant-statuses';

const pollingInterval = 2000;

const comparator = ordering(byString).on(({ label }) => label).compare;

@Component({
  selector: 'tenants',
  templateUrl: './tenants.component.html'
})
export class TenantsComponent implements OnDestroy {
  tenantType$: Observable<TenantType>;
  tenants$: Observable<TenantConfiguration[]>;
  destroyed$: Subject<void> = new Subject<void>();
  pollingCompleted$: Subject<void> = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: TenantService
  ) {
    this.tenantType$ = this.route.data.pipe(map(({ type }) => type));

    // TODO we should really only ping for status updates - not the entire tenant data
    this.tenants$ = combineLatest(
      this.tenantType$,
      timer(0, pollingInterval)
    ).pipe(
      takeUntil(this.destroyed$),
      takeUntil(this.pollingCompleted$),
      flatMap(([type]) =>
        this.service.getAll(type).pipe(
          map(tenants => tenants.slice().sort(comparator)),
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

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
