import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'groups',
  templateUrl: 'groups.component.html'
})
export class GroupsComponent implements OnInit {

  groups = [];

  filteredGroups = [];
  searchTerm : string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.groups = this.route.snapshot.data["groups"];
    this.filteredGroups = this.groups;
  }

  onSearchChange(event) {
    this.filteredGroups = this.groups.filter( x => x.name.toUpperCase().indexOf(this.searchTerm.toUpperCase()) >= 0)
  }
}
