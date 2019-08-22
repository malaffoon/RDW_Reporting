import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import { TenantConfiguration } from '../../model/tenant-configuration';
import { ActivatedRoute } from '@angular/router';
import { TenantService } from '../../service/tenant.service';
import {
  flatMap,
  map,
  publishReplay,
  refCount,
  takeUntil
} from 'rxjs/operators';

@Component({
  selector: 'app-tenant-metrics',
  templateUrl: './tenant-metrics.component.html',
  styleUrls: ['./tenant-metrics.component.less']
})
export class TenantMetricsComponent implements OnInit, OnDestroy {
  tenant$: Observable<TenantConfiguration>;
  metrics$: Observable<any>;
  initialized$: Observable<boolean>;
  destroyed$: Subject<void> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private tenantService: TenantService
  ) {}

  ngOnInit(): void {
    const key$ = this.route.params.pipe(map(({ id }) => id));

    this.tenant$ = key$.pipe(
      flatMap(key => this.tenantService.get(key)),
      publishReplay(),
      refCount()
    );
    this.metrics$ = key$.pipe(
      flatMap(key => this.tenantService.getMetrics(key)),
      publishReplay(),
      refCount()
    );

    this.initialized$ = combineLatest(this.tenant$, this.metrics$).pipe(
      takeUntil(this.destroyed$),
      map(() => true)
    );
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
