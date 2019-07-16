import { Component } from '@angular/core';
import { Group } from './group';
import { UserGroup } from '../user-group/user-group';
import { UserGroupService } from '../user-group/user-group.service';
import { GroupService } from './group.service';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'group-tabs',
  templateUrl: './group-tabs.component.html'
})
export class GroupTabsComponent {
  groups$: Observable<Group[]>;
  userGroups$: Observable<UserGroup[]>;
  initialized$: Observable<boolean>;

  constructor(
    private groupService: GroupService,
    private userGroupService: UserGroupService
  ) {
    this.groups$ = this.groupService.getGroups();
    this.userGroups$ = this.userGroupService.getGroups();
    this.initialized$ = forkJoin(this.groups$, this.userGroups$).pipe(
      map(() => true)
    );
  }
}
