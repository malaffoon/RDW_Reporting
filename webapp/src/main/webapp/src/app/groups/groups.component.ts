import {Component, OnInit} from "@angular/core";
import {DataService} from "../shared/data.service";

@Component({
  selector: 'groups',
  templateUrl: 'groups.component.html'
})
export class GroupsComponent implements OnInit {

  private groups = [];
  private filteredGroups = [];
  private searchTerm : string;

  constructor(private service: DataService) {}

  ngOnInit() {
    this.service.getGroups().subscribe(groups => {
      this.groups = groups;
      this.filteredGroups = groups;
    })
  }

  onSearchChange(event) {
    this.filteredGroups = this.groups.filter( x => x.name.toUpperCase().indexOf(this.searchTerm.toUpperCase()) >= 0)
  }
}
