import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { DataService } from '../../../shared/data/data.service';
import { TenantConfiguration } from '../model/tenant-configuration';

/**
 * Service responsible for managing organization embargo settings
 */
@Injectable({
  providedIn: 'root'
})
export class TenantService {
  mockData: TenantConfiguration[];

  constructor(private dataService: DataService) {
    // TODO: Remove mock object, make call to backend API to fetch sandboxes
    if (!this.mockData) {
      this.mockData = [
        {
          code: 'CA',
          label: 'California',
          description: 'A tenant or the state of California'
        },
        {
          code: 'MI',
          label: 'Michigan',
          description: 'A tenant for the state of Michigan'
        },
        {
          code: 'SBAC',
          label: 'Smarter Balanced',
          description: 'A tenant for the Smarter Balanced Assessment Consortium'
        },
        {
          code: 'SBAC_PT',
          label: 'Smarter Balanced Practice Tests',
          description: 'A tenant for practice tests'
        }
      ];
    }
  }

  /**
   * Gets all sandbox configurations for the system
   */
  getAll(): Observable<TenantConfiguration[]> {
    return new Observable(observer => observer.next(this.mockData));
  }

  create(tenant: TenantConfiguration): void {
    // TODO: Call the create API
    this.mockData.push(tenant);
  }

  update(tenant: TenantConfiguration): void {
    // TODO: Call the update API
    let index = this.mockData.findIndex(s => s.code === tenant.code);
    this.mockData[index] = tenant;
  }

  delete(tenantCode: string): Observable<boolean> {
    //TODO: Call the delete API
    let index = this.mockData.findIndex(s => s.code === tenantCode);
    if (index !== -1) {
      this.mockData.splice(index, 1);
      return Observable.create(true);
    } else {
      return Observable.create(false);
    }
  }
}
