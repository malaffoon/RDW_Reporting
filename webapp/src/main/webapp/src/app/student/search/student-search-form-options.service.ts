import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { StudentSearchFormOptions } from './student-search-form-options';
import { GroupService } from '../../groups/group.service';
import { OrganizationService } from '../../shared/organization/organization.service';
import { catchError, map } from 'rxjs/operators';
import { UserGroupService } from '../../user-group/user-group.service';

@Injectable()
export class StudentSearchFormOptionsService {
  constructor(
    private organizationService: OrganizationService,
    private groupService: GroupService,
    private userGroupService: UserGroupService
  ) {}

  getOptions(): Observable<StudentSearchFormOptions> {
    return forkJoin(
      this.organizationService.getSchools(),
      this.groupService.getGroups(),
      this.userGroupService.safelyGetGroups()
    ).pipe(
      map(
        ([schools, groups, userGroups]) =>
          <StudentSearchFormOptions>{
            schools: schools,
            groups: groups,
            userGroups: userGroups
          }
      )
    );
  }
}
