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

const TenantsRoute = `${AdminServiceRoute}/tenants`;
const SandboxesRoute = `${AdminServiceRoute}/sandboxes`;
const TenantDefaultsRoute = `${AdminServiceRoute}/tenants/defaults`;
const SandboxDataSetsRoute = `${AdminServiceRoute}/sandboxes/datasets`;

/**
 * Service responsible for managing tenants
 */
@Injectable({
  providedIn: 'root'
})
export class TenantService {
  constructor(private dataService: DataService) {}

  getAvailableDataSets(): Observable<DataSet[]> {
    return this.dataService
      .get(SandboxDataSetsRoute)
      .pipe(catchError(ResponseUtils.throwError));
  }

  /**
   * Gets default configuration properties for a tenant
   */
  getDefaultConfigurationProperties(
    type: TenantType = 'TENANT'
  ): Observable<any> {
    return this.dataService.get(TenantDefaultsRoute).pipe(
      map(configProperties => {
        if (type === 'SANDBOX') {
          return {
            // intentionally excluding datasets and archived here.
            aggregate: configProperties.aggregate,
            reporting: configProperties.reporting
          };
        }
        return mapConfigurationProperties(configProperties);
      })
    );
  }

  /**
   * Gets all sandbox configurations for the system
   */
  getAll(type: TenantType = 'TENANT'): Observable<SandboxConfiguration[]> {
    // TODO push to backend
    const route = type === 'TENANT' ? TenantsRoute : SandboxesRoute;
    return this.dataService
      .get(route)
      .pipe(
        map(serverTenants =>
          serverTenants.map(serverTenant => toTenant(serverTenant))
        )
      );
  }

  get(code: string): Observable<SandboxConfiguration> {
    // TODO open endpoint on backend
    return forkJoin(
      this.dataService.get(TenantsRoute),
      this.dataService.get(SandboxesRoute),
      this.dataService.get(TenantDefaultsRoute),
      this.dataService.get(SandboxDataSetsRoute)
    ).pipe(
      map(([tenants, sandboxes, defaults, dataSets]) => {
        const tenant: any = [...tenants, ...sandboxes].find(
          tenant => tenant.tenant.key === code
        );
        if (tenant.tenant.sandbox) {
          return toSandbox(tenant, defaults, dataSets);
        }
        return toTenant(tenant, defaults);
      })
    );
  }

  /**
   * Creates a new tenant
   * @param tenant - The tenant to create
   */
  create(tenant: SandboxConfiguration): Observable<SandboxConfiguration> {
    const route = tenant.sandbox ? SandboxesRoute : TenantsRoute;
    return this.dataService
      .post(route, toTenantApiModel(tenant))
      .pipe(map(() => tenant));
  }

  /**
   * Updates an existing tenant
   * @param tenant - The tenant to update
   */
  update(tenant: SandboxConfiguration): Observable<SandboxConfiguration> {
    const route = tenant.sandbox ? SandboxesRoute : TenantsRoute;
    return this.dataService
      .put(route, toTenantApiModel(tenant))
      .pipe(map(() => tenant));
  }

  /**
   * Deletes an existing tenant
   * @param code - The code or "key" of the tenant to delete
   */
  delete(code: string): Observable<void> {
    const route = SandboxesRoute; // cant delete tenants
    return this.dataService
      .delete(`${route}/${code}`)
      .pipe(catchError(ResponseUtils.throwError));
  }
}
