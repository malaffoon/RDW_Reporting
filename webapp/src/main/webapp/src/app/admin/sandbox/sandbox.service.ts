import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { DataService } from '../../shared/data/data.service';
import { DataTemplate, SandboxConfiguration } from './sandbox-configuration';

/**
 * Service responsible for managing organization embargo settings
 */
@Injectable()
export class SandboxService {
  mockData: SandboxConfiguration[];

  constructor(private dataService: DataService) {
    // TODO: Remove mock object, make call to backend API to fetch sandboxes

    if (!this.mockData) {
      // configProperties.set('reporting.analytics-tracking-id', '123456789');
      // configProperties.set(
      //   'reporting.interpretive-guide-url',
      //   'https://portal.smarterbalanced.org/library/en/reporting-system-interpretive-guide.pdf'
      // );
      // configProperties.set('reporting.landing-page-url', 'forward:/landing.html');
      // configProperties.set('reporting.state.code', 'CA');
      // configProperties.set('reporting.state.name', 'California');

      this.mockData = [
        {
          key: '79d05c3d',
          label: 'A Middle School Sandbox',
          description:
            'A test sandbox for middle school students with both ELA and MATH assessments',
          template: {
            key: 'template1',
            label: 'Middle School Template'
          }
        },
        {
          key: '130c9ab1',
          label: 'A High School Sandbox',
          description:
            'A sandbox for high school students with both ELA and MATH assessments',
          template: {
            key: 'template2',
            label: 'High School Template'
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
    // TODO: Call SAVE API
    this.mockData.push(sandbox);
  }

  update(sandbox: SandboxConfiguration): void {
    let index = this.mockData.findIndex(s => s.key === sandbox.key);
    this.mockData[index] = sandbox;
  }

  getAvailableDataTemplates(): Observable<DataTemplate[]> {
    //TODO: Pull these from database or other repository
    let mockDataTemplates = [
      {
        key: 'template0',
        label: 'Elementary School Template'
      },
      {
        key: 'template1',
        label: 'Middle School Template'
      },
      {
        key: 'template2',
        label: 'High School Template'
      }
    ];
    return new Observable(observer => observer.next(mockDataTemplates));
  }
}
