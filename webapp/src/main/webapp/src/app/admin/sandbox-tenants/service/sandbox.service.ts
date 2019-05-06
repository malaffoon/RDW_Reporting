import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { DataService } from '../../../shared/data/data.service';
import { DataSet, SandboxConfiguration } from '../model/sandbox-configuration';

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
      this.mockData = [
        {
          code: '79d05c3d',
          label: 'Michigan Summative Sandbox',
          description: 'A test sandbox with both ELA and MATH assessments',
          dataSet: {
            key: 'dataSet1',
            label: 'Michigan Summative Data Set'
          }
        },
        {
          code: '130c9ab1',
          label: 'SBAC Sandbox',
          description: 'Another sandbox with both ELA and MATH assessments',
          dataSet: {
            key: 'dataSet2',
            label: 'SBAC Interim Data Set'
          }
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
