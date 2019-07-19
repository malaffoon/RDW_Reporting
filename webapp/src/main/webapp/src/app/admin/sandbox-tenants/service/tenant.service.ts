import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DataService } from '../../../shared/data/data.service';
import { ResponseUtils } from '../../../shared/response-utils';
import { AdminServiceRoute } from '../../../shared/service-route';
import {
  mapConfigurationProperties,
  toSandbox,
  toTenant,
  toTenantApiModel
} from '../mapper/tenant.mapper';
import { DataSet, SandboxConfiguration } from '../model/sandbox-configuration';
import { TenantType } from '../model/tenant-type';
import { of } from 'rxjs/internal/observable/of';

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
  constructor(private dataService: DataService) {}

  /**
   * Gets default configuration properties for a sandbox
   */
  getDefaultConfigurationProperties(type: TenantType): Observable<any> {
    return this.dataService.get(DefaultsRoute).pipe(
      map(({ archive, aggregate, datasources, reporting }) =>
        mapConfigurationProperties(
          type === 'SANDBOX'
            ? {
                aggregate,
                reporting
              }
            : {
                archive,
                datasources,
                aggregate,
                reporting
              }
        )
      ),
      catchError(ResponseUtils.throwError)
    );
  }

  getSandboxDataSets(): Observable<DataSet[]> {
    return of([{ id: 'Data Set 1', label: 'Data Set 1' }]);

    // return this.dataService
    //   .get(DataSetsRoute)
    //   .pipe(catchError(ResponseUtils.throwError));
  }

  getAll(type: TenantType): Observable<SandboxConfiguration[]> {
    const tenants$ = this.dataService.get(ResourceRoute, { params: { type } });
    const defaults$ = this.dataService.get(DefaultsRoute);
    const dataSets$ = this.dataService.get(DataSetsRoute);
    const allTenants$ = forkJoin(tenants$, defaults$).pipe(
      map(([serverTenants, defaults]) =>
        serverTenants.map(serverTenant => toTenant(serverTenant, defaults))
      )
    );

    const allSandboxes$ = forkJoin(tenants$, defaults$, dataSets$).pipe(
      map(([serverTenants, defaults, dataSets]) =>
        serverTenants.map(serverTenant =>
          toSandbox(serverTenant, defaults, dataSets)
        )
      )
    );

    return type === 'TENANT' ? allTenants$ : allSandboxes$;
  }

  get(code: string): Observable<SandboxConfiguration> {
    const tenant$ = this.dataService.get(`${ResourceRoute}/${code}`);
    const defaults$ = this.dataService.get(DefaultsRoute);
    const dataSets$ = this.dataService.get(DataSetsRoute);
    return forkJoin(tenant$, defaults$, dataSets$).pipe(
      map(([tenant, defaults, dataSets]) => {
        if (tenant.tenant.sandbox) {
          return toSandbox(tenant, defaults, dataSets);
        }
        return toTenant(tenant, defaults);
      })
    );
  }

  /**
   * Creates a new sandbox
   * @param tenant - The sandbox to create
   */
  create(tenant: SandboxConfiguration): Observable<SandboxConfiguration> {
    return this.dataService
      .post(ResourceRoute, toTenantApiModel(tenant))
      .pipe(map(() => tenant));
  }

  /**
   * Updates an existing sandbox
   * @param tenant - The sandbox to update
   */
  update(tenant: SandboxConfiguration): Observable<SandboxConfiguration> {
    return this.dataService
      .put(ResourceRoute, toTenantApiModel(tenant))
      .pipe(map(() => tenant));
  }

  /**
   * Deletes an existing tenant
   * @param code - The code or "key" of the tenant to delete
   */
  delete(code: string): Observable<void> {
    return this.dataService
      .delete(`${ResourceRoute}/${code}`)
      .pipe(catchError(ResponseUtils.throwError));
  }
}
