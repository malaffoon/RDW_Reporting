import { Injectable } from '@angular/core';
import { ReportingServiceRoute } from '../shared/service-route';
import { catchError, flatMap, map } from 'rxjs/operators';
import { UserGroup, UserGroupRequest } from './user-group';
import { Observable, of } from 'rxjs';
import { DataService } from '../shared/data/data.service';
import { Student } from '../student/search/student';
import { Group } from '../groups/group';
import { UserService } from '../shared/security/service/user.service';

@Injectable({
  providedIn: 'root'
})
export class UserGroupService {
  constructor(
    private dataService: DataService,
    private userService: UserService
  ) {}

  safelyGetUserGroupsAsGroups(): Observable<Group[]> {
    return this.getGroups().pipe(
      map(userGroups =>
        userGroups.map(
          userGroup =>
            <Group>{
              id: userGroup.id,
              name: userGroup.name,
              schoolId: null,
              schoolName: '',
              subjectCode:
                userGroup.subjects != null ? userGroup.subjects[0] : undefined,
              userCreated: true
            }
        )
      ),
      catchError(() => of([]))
    );
  }

  getUserGroupAsGroup(groupId: number): Observable<Group> {
    return this.getGroup(groupId).pipe(
      map(
        userGroup =>
          <Group>{
            id: userGroup.id,
            name: userGroup.name,
            schoolId: null,
            schoolName: '',
            subjectCode:
              userGroup.subjects != null ? userGroup.subjects[0] : undefined,
            totalStudents: userGroup.students.length,
            userCreated: true
          }
      )
    );
  }

  safelyGetGroups(): Observable<UserGroup[]> {
    return this.getGroups().pipe(catchError(() => of([])));
  }

  getGroups(): Observable<UserGroup[]> {
    return this.hasReadPermission().pipe(
      flatMap(hasPermission =>
        hasPermission
          ? this.dataService
              .get(`${ReportingServiceRoute}/userGroups`)
              .pipe(
                map(serverGroups =>
                  serverGroups.map(serverGroup => this.toUserGroup(serverGroup))
                )
              )
          : of([])
      )
    );
  }

  getGroup(groupId: number): Observable<UserGroup> {
    return this.hasReadPermission().pipe(
      flatMap(hasPermission =>
        hasPermission
          ? this.dataService
              .get(`${ReportingServiceRoute}/userGroups/${groupId}`)
              .pipe(map(serverGroup => this.toUserGroup(serverGroup)))
          : of(undefined)
      )
    );
  }

  saveGroup(group: UserGroup): Observable<UserGroup> {
    if (group.id == null) {
      return this.createGroup(group);
    }
    return this.updateGroup(group).pipe(map(() => group));
  }

  deleteGroup(group: UserGroup): Observable<void> {
    return this.dataService.delete(
      `${ReportingServiceRoute}/userGroups/${group.id}`
    );
  }

  private hasReadPermission(): Observable<boolean> {
    return this.userService
      .getUser()
      .pipe(
        map(({ permissions }) => permissions.includes('TEACHER_GROUP_READ'))
      );
  }

  private createGroup(group: UserGroup): Observable<UserGroup> {
    return this.dataService
      .post(
        `${ReportingServiceRoute}/userGroups`,
        this.toUserGroupRequest(group)
      )
      .pipe(map(serverGroup => this.toUserGroup(serverGroup)));
  }

  private updateGroup(group: UserGroup): Observable<UserGroup> {
    return this.dataService.put(
      `${ReportingServiceRoute}/userGroups`,
      this.toUserGroupRequest(group)
    );
  }

  private toUserGroupRequest(group: UserGroup): UserGroupRequest {
    return {
      id: group.id,
      name: group.name,
      subjectCodes: group.subjects,
      studentIds: group.students.map(student => student.id)
    };
  }

  private toUserGroup(serverGroup: any): UserGroup {
    return {
      id: serverGroup.id,
      name: serverGroup.name,
      // TODO need to saturate empty subject filter with all subjects
      subjects: serverGroup.subjectCodes,
      students:
        serverGroup.students != null
          ? serverGroup.students.map(serverStudent =>
              this.toStudent(serverStudent)
            )
          : []
    };
  }

  private toStudent(serverStudent: any): Student {
    return {
      id: serverStudent.id,
      ssid: serverStudent.ssid,
      firstName: serverStudent.firstName,
      lastName: serverStudent.lastName,
      economicDisadvantage: serverStudent.economicDisadvantage,
      gender: serverStudent.genderCode,
      ethnicities: serverStudent.ethnicityCodes,
      englishLanguageAcquisitionStatus:
        serverStudent.englishLanguageAcquisitionStatusCode,
      individualEducationPlan: serverStudent.individualEducationPlan,
      limitedEnglishProficiency: serverStudent.limitedEnglishProficiency,
      section504: serverStudent.section504,
      migrantStatus: serverStudent.migrantStatus,
      languages: serverStudent.languages,
      militaryConnectedCodes: serverStudent.militaryConnectedCodes
    };
  }
}
