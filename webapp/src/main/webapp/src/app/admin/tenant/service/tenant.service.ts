import { Injectable } from '@angular/core';
import { forkJoin, Observable, throwError } from 'rxjs';
import { catchError, map, mapTo } from 'rxjs/operators';
import { DataService } from '../../../shared/data/data.service';
import { ResponseUtils } from '../../../shared/response-utils';
import { AdminServiceRoute } from '../../../shared/service-route';
import {
  toDefaultConfigurations,
  toServerTenant,
  toTenant
} from '../model/tenants';
import { DataSet, TenantConfiguration } from '../model/tenant-configuration';
import { TenantType } from '../model/tenant-type';
import { CachingDataService } from '../../../shared/data/caching-data.service';
import { of } from 'rxjs/internal/observable/of';
import { TenantStatus } from '../model/tenant-status';
import { TenantMetric, TenantMetricType } from '../model/tenant-metric';

const ResourceRoute = `${AdminServiceRoute}/tenants`;
const DefaultsRoute = `${AdminServiceRoute}/tenantDefaults`;
const DataSetsRoute = `${AdminServiceRoute}/sandboxDataSets`;

/**
 * Service responsible for sandboxes
 */
@Injectable({
  providedIn: 'root'
})
export class TenantService {
  constructor(
    private dataService: DataService,
    private cachingDataService: CachingDataService
  ) {}

  exists(key: string): Observable<boolean> {
    return this.dataService.head(`${ResourceRoute}/${key}`).pipe(
      mapTo(true),
      catchError(error => {
        if (error.status === 404) {
          return of(false);
        }
        return throwError(error);
      })
    );
  }

  existsId(id: string): Observable<boolean> {
    return this.dataService.head(`${ResourceRoute}/id/${id}`).pipe(
      mapTo(true),
      catchError(error => {
        if (error.status === 404) {
          return of(false);
        }
        return throwError(error);
      })
    );
  }

  getAll(type: TenantType): Observable<TenantConfiguration[]> {
    const tenants$ = this.dataService.get(ResourceRoute, { params: { type } });
    const defaults$ = this.cachingDataService.get(DefaultsRoute);
    const dataSets$ = this.cachingDataService.get(DataSetsRoute);
    const allTenants$ = forkJoin(tenants$, defaults$).pipe(
      map(([serverTenants, defaults]) =>
        serverTenants.map(serverTenant => toTenant(serverTenant, defaults))
      )
    );

    const allSandboxes$ = forkJoin(tenants$, defaults$, dataSets$).pipe(
      map(([serverTenants, defaults, dataSets]) =>
        serverTenants.map(serverTenant =>
          toTenant(serverTenant, defaults, dataSets)
        )
      )
    );

    return type === 'TENANT' ? allTenants$ : allSandboxes$;
  }

  get(key: string): Observable<TenantConfiguration> {
    const tenant$ = this.dataService.get(`${ResourceRoute}/${key}`);
    const defaults$ = this.cachingDataService.get(DefaultsRoute);
    const dataSets$ = this.cachingDataService.get(DataSetsRoute);
    return forkJoin(tenant$, defaults$, dataSets$).pipe(
      map(([tenant, defaults, dataSets]) =>
        toTenant(tenant, defaults, dataSets)
      )
    );
  }

  /**
   * Creates a new sandbox
   * @param tenant - The sandbox to create
   */
  create(tenant: TenantConfiguration): Observable<TenantConfiguration> {
    return this.dataService
      .post(ResourceRoute, toServerTenant(tenant))
      .pipe(map(() => tenant));
  }

  /**
   * Updates an existing sandbox
   * @param tenant - The sandbox to update
   */
  update(tenant: TenantConfiguration): Observable<TenantConfiguration> {
    return this.dataService
      .put(ResourceRoute, toServerTenant(tenant))
      .pipe(map(() => tenant));
  }

  /**
   * Deletes an existing tenant
   * @param key - The code or "key" of the tenant to delete
   */
  delete(key: string): Observable<void> {
    return this.dataService
      .delete(`${ResourceRoute}/${key}`)
      .pipe(catchError(ResponseUtils.throwError));
  }

  /**
   * Gets default configuration properties for a sandbox
   */
  getDefaultConfigurationProperties(type: TenantType): Observable<any> {
    return this.cachingDataService.get(DefaultsRoute).pipe(
      map(defaults => toDefaultConfigurations(defaults, type)),
      catchError(ResponseUtils.throwError)
    );
  }

  getSandboxDataSets(): Observable<DataSet[]> {
    return this.cachingDataService
      .get(DataSetsRoute)
      .pipe(catchError(ResponseUtils.throwError));
  }

  getMetrics(key: string): Observable<TenantMetric[]> {
    return this.dataService.get(`${ResourceRoute}/${key}/metrics`);
  }

  updateStatus(key: string, status: TenantStatus): Observable<void> {
    return this.dataService.put(`${ResourceRoute}/${key}/status`, status);
  }

  deleteStatus(key: string): Observable<void> {
    return this.dataService.delete(`${ResourceRoute}/${key}/status`);
  }
}
