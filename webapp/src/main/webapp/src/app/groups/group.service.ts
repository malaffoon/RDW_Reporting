import { Injectable } from '@angular/core';
import { ReportingServiceRoute } from '../shared/service-route';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { byString } from '@kourge/ordering/comparator';
import { ordering } from '@kourge/ordering';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Group } from './group';
import { DataService } from '../shared/data/data.service';
import { CachingDataService } from '../shared/data/caching-data.service';

@Injectable()
export class GroupService {

  constructor(private dataService: DataService,
              private cachingDataService: CachingDataService) {
  }

  getGroups(): Observable<Group[]> {
    return forkJoin(
      this.cachingDataService.get(`${ReportingServiceRoute}/groups`),
      this.dataService.get(`${ReportingServiceRoute}/userGroups`)
    ).pipe(
      map(([serverGroups, serverUserGroups]) => serverGroups
        .concat(serverUserGroups)
        .map(serverGroup => this.toGroup(serverGroup))
        .sort(ordering(byString).on<Group>(group => group.name).compare)
      )
    );
  }

  getGroup(groupId: number): Observable<Group> {
    return this.dataService.get(`${ReportingServiceRoute}/groups/${groupId}`).pipe(
      map(serverGroup => this.toGroup(serverGroup))
    );
  }

  private toGroup(serverGroup: any): Group {
    return {
      id: serverGroup.id,
      name: serverGroup.name,
      schoolName: serverGroup.schoolName,
      schoolId: serverGroup.schoolId,
      subjectCode: serverGroup.subjectCode || 'ALL',
      userCreated: serverGroup.userCreated,
      totalStudents: serverGroup.studentCount
    };
  }

}
