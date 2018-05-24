import { Injectable } from '@angular/core';
import { ReportingServiceRoute } from '../shared/service-route';
import { catchError, map } from 'rxjs/operators';
import { Student, UserGroup, UserGroupRequest } from './user-group';
import { Observable } from 'rxjs/Observable';
import { DataService } from '../shared/data/data.service';
import { of } from 'rxjs/observable/of';
import { TranslateService } from '@ngx-translate/core';
import { _throw } from 'rxjs/observable/throw';

@Injectable()
export class UserGroupService {

  constructor(private dataService: DataService,
              private translate: TranslateService) {
  }

  getGroups(): Observable<UserGroup[]> {
    return this.dataService.get(`${ReportingServiceRoute}/userGroups`).pipe(
      map(serverGroups => serverGroups.map(serverGroup => this.toUserGroup(serverGroup)))
    );
  }

  // getGroupOrDefaultGroup(groupId: number): Observable<UserGroup> {
  //   return this.getGroup(groupId).pipe(
  //     catchError(response => {
  //       if (response.status === 404) {
  //         return of(this.createDefaultGroup());
  //       }
  //       return _throw(response);
  //     })
  //   );
  // }

  getGroup(groupId: number): Observable<UserGroup> {
    return this.dataService.get(`${ReportingServiceRoute}/userGroups/${groupId}`).pipe(
      map(serverGroup => this.toUserGroup(serverGroup))
    );
  }

  createDefaultGroup(): UserGroup {
    return {
      name: this.translate.instant('user-group.default-name'),
      subjectCodes: [],
      students: []
    };
  }

  saveGroup(group: UserGroup): Observable<UserGroup> {
    if (group.id == null) {
      return this.createGroup(group);
    }
    return this.updateGroup(group).pipe(map(() => group));
  }

  private createGroup(group: UserGroup): Observable<UserGroup> {
    return this.dataService.post(`${ReportingServiceRoute}/userGroups`, this.toUserGroupRequest(group)).pipe(
      map(serverGroup => this.toUserGroup(serverGroup))
    );
  }

  private updateGroup(group: UserGroup): Observable<UserGroup> {
    return this.dataService.put(`${ReportingServiceRoute}/userGroups`, this.toUserGroupRequest(group));
  }

  deleteGroup(groupId: number): Observable<void> {
    return this.dataService.delete(`${ReportingServiceRoute}/userGroups/${groupId}`);
  }

  private toUserGroupRequest(group: UserGroup): UserGroupRequest {
    return {
      id: group.id,
      name: group.name,
      subjectCodes: group.subjectCodes,
      studentIds: group.students.map(student => student.id)
    };
  }

  private toUserGroup(serverGroup: any): UserGroup {
    return {
      id: serverGroup.id,
      name: serverGroup.name,
      subjectCodes: serverGroup.subjectCodes,
      students: serverGroup.students != null
        ? serverGroup.students.map(serverStudent => this.toStudent(serverStudent))
        : []
    };
  }

  private toStudent(serverStudent: any): Student {
    return {
      id: serverStudent.id,
      ssid: serverStudent.ssid,
      firstName: serverStudent.firstName,
      lastName: serverStudent.lastName,
      genderCode: serverStudent.genderCode,
      ethnicityCodes: serverStudent.ethnicityCodes,
      englishLanguageAcquisitionStatusCode: serverStudent.englishLanguageAcquisitionStatusCode,
      individualEducationPlan: serverStudent.individualEducationPlan,
      limitedEnglishProficiency: serverStudent.limitedEnglishProficiency,
      section504: serverStudent.section504,
      migrantStatus: serverStudent.migrantStatus
    };
  }

}
