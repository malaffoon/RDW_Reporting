import { Observable, forkJoin } from 'rxjs';
import { Injectable } from '@angular/core';
import { DataService } from '../../../shared/data/data.service';
import {
  toSandboxApiModel,
  mapSandbox,
  mapConfigurationProperties
} from '../mapper/tenant.mapper';
import { catchError, map } from 'rxjs/operators';
import { AdminServiceRoute } from '../../../shared/service-route';
import { ResponseUtils } from '../../../shared/response-utils';
import { DataSet, SandboxConfiguration } from '../model/sandbox-configuration';

const ResourceRoute = `${AdminServiceRoute}/sandboxes`;
const DefaultsRoute = `${AdminServiceRoute}/tenants/defaults`;
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
    return this.dataService.get(`${DefaultsRoute}`).pipe(
      map(apiModel => mapConfigurationProperties(apiModel)),
      catchError(ResponseUtils.throwError)
    );
  }

  getAvailableDataSets(): Observable<DataSet[]> {
    return this.dataService
      .get(`${DataSetsRoute}`)
      .pipe(catchError(ResponseUtils.throwError));
  }

  /**
   * Gets all sandbox configurations for the system
   */
  getAll(): Observable<SandboxConfiguration[]> {
    return forkJoin([
      this.dataService.get(`${ResourceRoute}`),
      this.dataService.get(`${DefaultsRoute}`),
      this.dataService.get(`${DataSetsRoute}`)
    ]).pipe(
      map(results => {
        const sandboxConfigurations = results[0];
        const defaultConfiguration = results[1];
        const datasets = results[2];

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
      .post(`${ResourceRoute}`, toSandboxApiModel(sandbox))
      .pipe(
        map(createdSandbox => mapSandbox(createdSandbox, {}, dataSets)),
        catchError(ResponseUtils.throwError)
      );
  }

  /**
   * Updates an existing sandbox
   * @param sandbox - The sandbox to update
   */
  update(sandbox: SandboxConfiguration): Observable<SandboxConfiguration> {
    return this.dataService
      .put(`${ResourceRoute}`, toSandboxApiModel(sandbox))
      .pipe(
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
