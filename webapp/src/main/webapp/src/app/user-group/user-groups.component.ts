import { Component, OnInit } from '@angular/core';
import { UserGroupService } from './user-group.service';
import { UserGroup } from './user-group';
import { FilterOptionsService } from '../shared/filter/filter-options.service';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Component({
  selector: 'user-groups',
  templateUrl: './user-groups.component.html'
})
export class UserGroupsComponent implements OnInit {

  groups: UserGroup[];
  defaultGroup: UserGroup;
  subjects: string[];

  search: string;
  searchThreshold: number = 10;
  filteredGroups: UserGroup[];

  initialized: boolean = false;

  constructor(private service: UserGroupService,
              private filterOptionService: FilterOptionsService) {
  }

  ngOnInit(): void {
    forkJoin(
      this.service.getGroups(),
      this.filterOptionService.getFilterOptions()
    ).subscribe(([ groups, options ]) => {
      this.groups = groups;
      this.filteredGroups = groups.concat();

      if (groups && groups.length) {
        this.defaultGroup = groups[ 0 ];
      }

      this.subjects = options.subjects;

      this.initialized = true;
    });
  }

  onSearchChange() {
    this.filteredGroups = this.groups
      .filter(group => group.name.toLowerCase().includes(this.search.toLowerCase()));
  }

  get emptyMessageCode(): string {
    return this.groups && this.groups.length > 0 ?
      'groups.empty-message' :
      'groups.no-groups-message';
  }

}
