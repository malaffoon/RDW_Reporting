import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { DataService } from '../shared/data/data.service';
import { catchError, map } from 'rxjs/operators';
import { AdminServiceRoute } from '../shared/service-route';
import { ResponseUtils } from '../shared/response-utils';
import { Sandbox } from './sandbox';

const ResourceRoute = `${AdminServiceRoute}/sandboxes/login`;

/**
 * Service responsible for sandboxes
 */
@Injectable({
  providedIn: 'root'
})
export class SandboxLoginService {
  constructor(private dataService: DataService) {}

  /**
   * Gets all sandbox configurations for the system
   */
  getAll(): Observable<Sandbox[]> {
    const mockData = [
      {
        label: 'California Sandbox',
        key: 'ca_sandbox_0',
        baseUrl: 'http://localhost:8080/sandbox/',
        roles: [
          {
            id: 'teacher_harborside_g4',
            label: 'Teacher - Harborside - Grade 4'
          },
          {
            id: 'teacher_harborside_g5',
            label: 'Teacher - Harborside - Grade 5'
          },
          {
            id: 'teacher_harborside_g6',
            label: 'Teacher - Harborside - Grade 6'
          },
          {
            id: 'district_sweetwater',
            label: 'District Administrator - Sweetwater'
          },
          {
            id: 'district_san_diego',
            label: 'District Administrator - San Diego'
          },
          {
            id: 'school_admin_harborside',
            label: 'School Administrator - Harborside'
          },
          {
            id: 'school_admin_castle_park',
            label: 'School Administrator - Castle Park'
          }
        ]
      },
      {
        label: 'Michigan Sandbox',
        key: 'mi_sandbox_0',
        baseUrl: 'http://localhost:8080/sandbox/',
        roles: [
          {
            id: 'teacher_rosebank_g4',
            label: 'Teacher - Rosebank - Grade 6'
          },
          {
            id: 'teacher_rosebank_g4',
            label: 'Teacher - Rosebank - Grade 7'
          },
          {
            id: 'teacher_rosebank_g4',
            label: 'Teacher - Rosebank - Grade 8'
          },
          {
            id: 'district_sweetwater',
            label: 'District Administrator - Detroit'
          },
          {
            id: 'district_lansing',
            label: 'District Administrator - Landsing'
          },
          {
            id: 'school_admin_detroit',
            label: 'School Administrator - Detroit Elementary'
          },
          {
            id: 'school_admin_grand_rapids',
            label: 'School Administrator - Grand Rapids'
          }
        ]
      }
    ];

    return new Observable(observer => observer.next(mockData));
    // TODO: Integrate API
    // return this.dataService
    //   .get(`${ResourceRoute}`);
  }

  /**
   * Creates a new sandbox
   * @param sandbox - The sandbox to create
   */
  login(sandbox: Sandbox, username: string, roleKey: string): Observable<void> {
    // TODO: Integrate API
    return Observable.create();
  }
}
