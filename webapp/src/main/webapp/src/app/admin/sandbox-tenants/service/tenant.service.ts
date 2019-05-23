import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { DataService } from '../../../shared/data/data.service';
import { TenantConfiguration } from '../model/tenant-configuration';
import { mapFromTenant, mapTenant } from '../mapper/tenant.mapper';
import { catchError, map } from 'rxjs/operators';
import { AdminServiceRoute } from '../../../shared/service-route';
import { ResponseUtils } from '../../../shared/response-utils';

const ServiceRoute = `${AdminServiceRoute}/tenants`;

/**
 * Service responsible for managing organization embargo settings
 */
@Injectable({
  providedIn: 'root'
})
export class TenantService {
  mockData: TenantConfiguration[];

  constructor(private dataService: DataService) {}

  /**
   * Gets default configuration properties for a tenant
   */
  getDefaultConfigurationProperties(): Observable<any> {
    return this.dataService
      .get(`${ServiceRoute}/`)
      .pipe(map(apiTenants => apiTenants['applicationTenantConfiguration']));
  }

  /**
   * Gets all sandbox configurations for the system
   */
  getAll(): Observable<TenantConfiguration[]> {
    return this.dataService.get(`${ServiceRoute}/`).pipe(
      map(
        apiTenants =>
          apiTenants.tenants.map(apiTenant =>
            mapTenant(apiTenant, apiTenants['applicationTenantConfiguration'])
          ) //applicationTenantConfiguration))
      )
    );
  }

  /**
   * Creates a new tenant
   * @param tenant - The tenant to create
   */
  create(tenant: TenantConfiguration): Observable<void> {
    return this.dataService
      .post(`${ServiceRoute}`, mapFromTenant(tenant))
      .pipe(catchError(ResponseUtils.throwError));
  }

  /**
   * Updates an existing tenant
   * @param tenant - The tenant to update
   */
  update(tenant: TenantConfiguration): Observable<void> {
    return this.dataService
      .put(`${ServiceRoute}`, mapFromTenant(tenant))
      .pipe(catchError(ResponseUtils.throwError));
  }

  /**
   * Deletes an existing tenant
   * @param tenantCode - The code or "key" of the tenant to delete
   */
  delete(tenantCode: string): Observable<void> {
    return this.dataService
      .delete(`${ServiceRoute}/${tenantCode}`)
      .pipe(catchError(ResponseUtils.throwError));
  }
}
