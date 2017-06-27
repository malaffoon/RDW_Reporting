import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'groups',
  templateUrl: 'groups.component.html'
})
export class GroupsComponent implements OnInit {
  /**
   * The array of groups that a user has access to.
   */
  @Input()
  groups = [];

  filteredGroups = [];
  searchTerm : string;

  constructor() {}

  ngOnInit() {
    this.filteredGroups = this.groups;
  }

  onSearchChange(event) {
    this.filteredGroups = this.groups.filter( x => x.name.toUpperCase().indexOf(this.searchTerm.toUpperCase()) >= 0)
  }
}
