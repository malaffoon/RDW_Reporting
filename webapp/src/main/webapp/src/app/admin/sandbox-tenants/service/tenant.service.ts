import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { DataService } from '../../../shared/data/data.service';
import { TenantConfiguration } from '../model/tenant-configuration';
import {
  mapFromSandbox,
  mapFromTenant,
  mapTenant
} from '../mapper/tenant.mapper';

/**
 * Service responsible for managing organization embargo settings
 */
@Injectable({
  providedIn: 'root'
})
export class TenantService {
  mockData: TenantConfiguration[];

  constructor(private dataService: DataService) {
    // TODO: Remove mock object, make call to backend API to fetch tenants
    if (!this.mockData) {
      let mockResponse = {
        applicationTenantConfiguration: {
          datasources: {
            reporting_ro_datasource: {
              'url-server': 'rdw-aurora-',
              username: 'sbac',
              password: '****'
            },
            warehouse_rw_datasource: {
              'url-server': 'rdw-aurora-',
              username: 'sbac',
              password: '****'
            },
            olap_ro_datasource: {
              'url-server': 'rdw-aurora-',
              username: 'sbac',
              password: '****'
            },
            reporting_rw_datasource: {
              'url-server': 'rdw-aurora-',
              username: 'sbac',
              password: '****'
            }
          },
          reporting: {
            'school-year': '2018',
            'transfer-access-enabled': 'true',
            'translation-location': 'binary-',
            'analytics-tracking-id': 'UA-102446884-4',
            'interpretive-guide-url':
              'https://portal.smarterbalanced.org/library/en/reporting-system-interpretive-guide.pdf',
            'user-guide-url':
              'https://portal.smarterbalanced.org/library/en/reporting-system-user-guide.pdf',
            'access-denied-url': 'forward:/assets/public/access-denied.html',
            'landing-page-url': 'forward:/landing.html',
            'percentile-display-enabled': 'true',
            'report-languages': 'es',
            'ui-languages': 'es',
            'student-fields': {
              EconomicDisadvantage: 'disabled',
              LimitedEnglishProficiency: 'disabled',
              MigrantStatus: 'enabled',
              EnglishLanguageAcquisitionStatus: 'enabled',
              PrimaryLanguage: 'enabled',
              Ethnicity: 'enabled',
              Gender: 'admin',
              IndividualEducationPlan: 'admin',
              Section504: 'admin'
            },
            state: {
              code: 'CA',
              name: 'California'
            }
          },
          task: {
            'remove-stale-reports': {
              cron: '0 0 8 * * *',
              'max-report-lifetime-days': '30',
              'max-random-minutes': '20'
            }
          },
          archive: {
            'uri-root': 's3://ca-archive',
            'path-prefix': 'ca',
            's3-access-key': 'ca_access_key',
            's3-secret-key': 'ca_secret_key',
            's3-sse': 'ca'
          },
          aggregator: {
            'statewide-user-assessment-types': 'iab',
            'state-aggregate-assessment-types': 'sum'
          }
        },
        tenants: [
          {
            tenant: {
              id: 'CA',
              key: 'CA',
              name: 'California',
              description: 'This is a description'
            },
            applicationTenantConfiguration: {
              datasources: {
                reporting_ro_datasource: {
                  initialSize: '1',
                  maxActive: '2',
                  password: 'password123'
                },
                warehouse_rw_datasource: {
                  initialSize: '1',
                  maxActive: '2'
                },
                olap_ro_datasource: {
                  initialSize: '1',
                  maxActive: '2'
                },
                reporting_rw_datasource: {
                  initialSize: '1',
                  maxActive: '2'
                }
              },
              reporting: {
                'percentile-display-enabled': 'false',
                'student-fields': {
                  EconomicDisadvantage: 'enabled'
                },
                state: {
                  code: 'SBAC',
                  name: 'Smarter Balanced'
                }
              }
            }
          },
          {
            tenant: {
              id: 'MI',
              key: 'MI',
              name: 'Michigan',
              description: 'A tenant for the state of Michigan'
            }
          },
          {
            tenant: {
              id: 'SBAC',
              key: 'SBAC',
              name: 'Smarter Balanced',
              description:
                'A tenant for the Smarter Balanced Assessment Consortium'
            }
          }
        ]
      };

      this.mockData = mockResponse.tenants.map(tenant =>
        mapTenant(tenant, mockResponse.applicationTenantConfiguration)
      );
    }
  }

  /**
   * Gets default configuration properties for a tenant
   */
  getDefaultConfigurationProperties(): Observable<any> {
    //TODO: Actually call getAll() and read applicationTenantConfiguration
    const mockProperties = {
      datasources: {
        reporting_ro_datasource: {
          'url-server': 'rdw-aurora-',
          username: 'sbac',
          password: '****'
        },
        warehouse_rw_datasource: {
          'url-server': 'rdw-aurora-',
          username: 'sbac',
          password: '****'
        },
        olap_ro_datasource: {
          'url-server': 'rdw-aurora-',
          username: 'sbac',
          password: '****'
        },
        reporting_rw_datasource: {
          'url-server': 'rdw-aurora-',
          username: 'sbac',
          password: '****'
        }
      },
      reporting: {
        'school-year': '2018',
        'transfer-access-enabled': 'true',
        'translation-location': 'binary-',
        'analytics-tracking-id': 'UA-102446884-4',
        'interpretive-guide-url':
          'https://portal.smarterbalanced.org/library/en/reporting-system-interpretive-guide.pdf',
        'user-guide-url':
          'https://portal.smarterbalanced.org/library/en/reporting-system-user-guide.pdf',
        'access-denied-url': 'forward:/assets/public/access-denied.html',
        'landing-page-url': 'forward:/landing.html',
        'percentile-display-enabled': 'true',
        'report-languages': 'es',
        'ui-languages': 'es',
        'student-fields': {
          EconomicDisadvantage: 'disabled',
          LimitedEnglishProficiency: 'disabled',
          MigrantStatus: 'enabled',
          EnglishLanguageAcquisitionStatus: 'enabled',
          PrimaryLanguage: 'enabled',
          Ethnicity: 'enabled',
          Gender: 'admin',
          IndividualEducationPlan: 'admin',
          Section504: 'admin'
        },
        state: {
          code: 'CA',
          name: 'California'
        }
      },
      task: {
        'remove-stale-reports': {
          cron: '0 0 8 * * *',
          'max-report-lifetime-days': '30',
          'max-random-minutes': '20'
        }
      }
    };
    return new Observable(observer => observer.next(mockProperties));
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
    let mappedTenant = mapFromTenant(tenant);
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
