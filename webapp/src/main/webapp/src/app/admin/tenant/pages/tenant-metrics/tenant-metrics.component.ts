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
import { TenantMetric, TenantMetricType } from '../../model/tenant-metric';
import { ranking } from '@kourge/ordering/comparator';
import { ordering } from '@kourge/ordering';

interface TenantMetricByType {
  type: TenantMetricType;
  values: TenantMetric[];
}

function groupByType(metrics: TenantMetric[]): TenantMetricByType[] {
  return metrics.reduce((groups, value) => {
    const group = groups.find(({ type }) => type === value.type);
    if (group == null) {
      groups.push({
        type: value.type,
        values: [value]
      });
    } else {
      group.values.push(value);
    }
    return groups;
  }, []);
}

const byType = ordering(ranking(['Schools', 'Students', 'Subjects'])).on(
  ({ type }) => type
).compare;

@Component({
  selector: 'app-tenant-metrics',
  templateUrl: './tenant-metrics.component.html',
  styleUrls: ['./tenant-metrics.component.less']
})
export class TenantMetricsComponent implements OnInit, OnDestroy {
  tenant$: Observable<TenantConfiguration>;
  metrics$: Observable<TenantMetricByType[]>;
  initialized$: Observable<boolean>;
  destroyed$: Subject<void> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private tenantService: TenantService
  ) {}

  ngOnInit(): void {
    const key$ = this.route.params.pipe(map(({ id }) => id));

    this.tenant$ = key$.pipe(
      flatMap(key =>
        this.tenantService
          .getAll(this.route.snapshot.data.type)
          .pipe(map(tenants => tenants.find(tenant => tenant.code === key)))
      ),
      publishReplay(),
      refCount()
    );
    this.metrics$ = key$.pipe(
      flatMap(key => this.tenantService.getMetrics(key)),
      map(metrics => groupByType(metrics).sort(byType)),
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
