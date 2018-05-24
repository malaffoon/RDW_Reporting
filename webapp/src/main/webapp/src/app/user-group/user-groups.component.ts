import { Component, OnInit } from '@angular/core';
import { UserGroupService } from './user-group.service';
import { UserGroup } from './user-group';


@Component({
  selector: 'user-groups',
  templateUrl: './user-groups.component.html'
})
export class UserGroupsComponent implements OnInit {

  groups: UserGroup[];
  filteredGroups: UserGroup[];
  search: string;

  constructor(private service: UserGroupService) {

  }

  ngOnInit(): void {
    this.service.getGroups()
      .subscribe(groups => this.groups = this.filteredGroups = groups);
  }

  onSearchChange(): void {
    this.filteredGroups = this.groups
      .filter(group => group.name.includes(this.search));
  }

  onCreateGroupButtonClick(): void {

  }

}

