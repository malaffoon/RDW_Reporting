import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { DataService } from '../../../shared/data/data.service';
import { DataSet, SandboxConfiguration } from '../model/sandbox-configuration';
import { mapSandbox } from '../mapper/tenant.mapper';

/**
 * Service responsible for managing organization embargo settings
 */
@Injectable({
  providedIn: 'root'
})
export class SandboxService {
  mockData: SandboxConfiguration[];

  constructor(private dataService: DataService) {
    // TODO: Remove mock object, make call to backend API to fetch sandboxes
    if (!this.mockData) {
      let mockSandbox1 = {
        tenant: {
          id: 'CA',
          key: 'CA',
          name: 'California',
          description: 'This is a description'
        },
        configurationProperties: {
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
        },
        tenantOverrides: {
          tenant: {
            id: 'CA',
            key: 'CA',
            name: 'California',
            description: 'This is a description'
          },
          configurationProperties: {
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
        }
      };
      this.mockData = [
        mapSandbox(mockSandbox1),
        {
          code: 'sbac_sandbox_0',
          label: 'SBAC Sandbox',
          description: 'Another sandbox with both ELA and MATH assessments',
          dataSet: {
            key: 'dataSet2',
            label: 'SBAC Interim Data Set'
          },
          configurationProperties: {}
        }
      ];
    }
  }

  /**
   * Gets all sandbox configurations for the system
   */
  getAll(): Observable<SandboxConfiguration[]> {
    return new Observable(observer => observer.next(this.mockData));
  }

  create(sandbox: SandboxConfiguration): void {
    // TODO: Call the create API
    this.mockData.push(sandbox);
  }

  update(sandbox: SandboxConfiguration): void {
    // TODO: Call the update API
    let index = this.mockData.findIndex(s => s.code === sandbox.code);
    this.mockData[index] = sandbox;
  }

  delete(sandboxCode: string): Observable<boolean> {
    //TODO: Call the delete API
    let index = this.mockData.findIndex(s => s.code === sandboxCode);
    if (index !== -1) {
      this.mockData.splice(index, 1);
      return Observable.create(true);
    } else {
      return Observable.create(false);
    }
  }

  archive(sandboxCode: string): Observable<boolean> {
    //TODO: Call the archive API
    return Observable.create(true);
  }

  resetData(sandboxCode: string): Observable<boolean> {
    //TODO: Call the reset data API
    return Observable.create(true);
  }

  getAvailableDataSets(): Observable<DataSet[]> {
    //TODO: Pull these from database or other repository
    let mockDataSets = [
      {
        key: 'dataSet0',
        label: 'California Interim Data Set'
      },
      {
        key: 'dataSet1',
        label: 'Michigan Summative Data Set'
      },
      {
        key: 'dataSet2',
        label: 'SBAC Interim Data Set'
      }
    ];
    return new Observable(observer => observer.next(mockDataSets));
  }
}
