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
import { TenantConfiguration } from '../model/tenant-configuration';

const ResourceRoute = `${AdminServiceRoute}/sandboxes`;
const TenantsRoute = `${AdminServiceRoute}/tenants`;
const DefaultsRoute = `${TenantsRoute}/defaults`;
const DataSetsRoute = `${ResourceRoute}/datasets`;

/**
 * Service responsible for sandboxes
 */
@Injectable({
  providedIn: 'root'
})
export class SandboxService {
  constructor(private dataService: DataService) {}

  /**
   * Gets default configuration properties for a sandbox
   */
  getDefaultConfigurationProperties(): Observable<any> {
    return this.dataService.get(DefaultsRoute).pipe(
      map(config => {
        return {
          // intentionally excluding datasets and archived here.
          aggregate: config.aggregate,
          reporting: config.reporting
        };
      }),
      catchError(ResponseUtils.throwError)
    );
  }

  getAvailableDataSets(): Observable<DataSet[]> {
    return this.dataService
      .get(DataSetsRoute)
      .pipe(catchError(ResponseUtils.throwError));
  }

  getTenants(): Observable<TenantConfiguration[]> {
    return this.dataService
      .get(TenantsRoute)
      .pipe(
        map(
          apiModels => apiModels.map(apiModel => mapTenant(apiModel, {}, true)),
          catchError(ResponseUtils.throwError)
        )
      );
  }

  /**
   * Gets all sandbox configurations for the system
   */
  getAll(): Observable<SandboxConfiguration[]> {
    return forkJoin([
      this.dataService.get(ResourceRoute),
      this.dataService.get(DefaultsRoute),
      this.dataService.get(DataSetsRoute)
    ]).pipe(
      map(([sandboxConfigurations, defaultConfiguration, datasets]) => {
        return sandboxConfigurations.map(sandboxConfiguration =>
          mapSandbox(sandboxConfiguration, defaultConfiguration, datasets)
        );
      })
    );
  }

  /**
   * Creates a new sandbox
   * @param sandbox - The sandbox to create
   */
  create(
    sandbox: SandboxConfiguration,
    dataSets = []
  ): Observable<SandboxConfiguration> {
    return this.dataService
      .post(ResourceRoute, toSandboxApiModel(sandbox))
      .pipe(
        // map(createdSandbox => mapSandbox(createdSandbox, {}, dataSets)),
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
   * @param sandboxCode - The code or "key" of the sandbox to delete
   */
  delete(sandboxCode: string): Observable<void> {
    return this.dataService
      .delete(`${ResourceRoute}/${sandboxCode}`)
      .pipe(catchError(ResponseUtils.throwError));
  }
}
