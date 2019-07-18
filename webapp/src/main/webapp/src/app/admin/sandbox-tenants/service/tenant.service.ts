import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DataService } from '../../../shared/data/data.service';
import { ResponseUtils } from '../../../shared/response-utils';
import { AdminServiceRoute } from '../../../shared/service-route';
import {
  mapSandbox,
  mapTenant,
  toSandboxApiModel
} from '../mapper/tenant.mapper';
import { DataSet, SandboxConfiguration } from '../model/sandbox-configuration';
import { TenantType } from '../model/tenant-type';

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
      map(defaults => {
        if (type === 'SANDBOX') {
          return {
            // intentionally excluding datasets and archived here.
            aggregate: defaults.aggregate,
            reporting: defaults.reporting
          };
        }
        return defaults;
      }),
      catchError(ResponseUtils.throwError)
    );
  }

  getSandboxDataSets(): Observable<DataSet[]> {
    return this.dataService
      .get(DataSetsRoute)
      .pipe(catchError(ResponseUtils.throwError));
  }

  /**
   * Gets all sandbox configurations for the system
   */
  getAll(type: TenantType): Observable<SandboxConfiguration[]> {
    const tenants$ = this.dataService.get(ResourceRoute, { params: { type } });
    const defaults$ = this.dataService.get(DefaultsRoute);
    const dataSets$ = this.dataService.get(DataSetsRoute);
    const allTenants$ = forkJoin(tenants$, defaults$).pipe(
      map(([serverTenants, defaults]) =>
        serverTenants.map(serverTenant => mapTenant(serverTenant, defaults))
      )
    );

    const allSandboxes$ = forkJoin(tenants$, defaults$, dataSets$).pipe(
      map(([serverTenants, defaults, dataSets]) =>
        serverTenants.map(serverTenant =>
          mapSandbox(serverTenant, defaults, dataSets)
        )
      )
    );

    return type === 'TENANT' ? allTenants$ : allSandboxes$;
  }

  /**
   * Creates a new sandbox
   * @param sandbox - The sandbox to create
   */
  create(sandbox: SandboxConfiguration): Observable<SandboxConfiguration> {
    return this.dataService
      .post(ResourceRoute, toSandboxApiModel(sandbox))
      .pipe(
        map(() => sandbox),
        catchError(ResponseUtils.throwError)
      );
  }

  /**
   * Updates an existing sandbox
   * @param sandbox - The sandbox to update
   */
  update(sandbox: SandboxConfiguration): Observable<SandboxConfiguration> {
    return this.dataService.put(ResourceRoute, toSandboxApiModel(sandbox)).pipe(
      map(() => sandbox),
      catchError(ResponseUtils.throwError)
    );
  }

  /**
   * Deletes an existing sandbox
   * @param code - The code or "key" of the sandbox to delete
   */
  delete(code: string): Observable<void> {
    return this.dataService
      .delete(`${ResourceRoute}/${code}`)
      .pipe(catchError(ResponseUtils.throwError));
  }
}
