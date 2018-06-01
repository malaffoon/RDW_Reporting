import { Component, OnInit } from "@angular/core";
import { Group } from './group';
import { GroupService } from './group.service';

@Component({
  selector: 'groups',
  templateUrl: 'groups.component.html'
})
export class GroupsComponent implements OnInit {

  groups: Group[];
  defaultGroup: Group;
  search: string;
  searchThreshold: number = 10;
  filteredGroups: Group[] = [];

  constructor(private groupService: GroupService) {
    this.groupService.getGroups().subscribe(groups => {
      const groupsCopy = groups.concat();
      this.groups = groupsCopy;
      this.filteredGroups = groupsCopy;

      if (this.groups && this.groups.length) {
        this.defaultGroup = this.groups[ 0 ];
      }
    });
  }

  ngOnInit() {
    this.filteredGroups = this.groups;
  }

  onSearchChange() {
    this.filteredGroups = this.groups.filter( group =>
      group.name.toLowerCase().indexOf(this.search.toLowerCase()) >= 0);
  }

}
