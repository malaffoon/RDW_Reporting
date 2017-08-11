import { Component, OnInit } from "@angular/core";
import { GroupFilterOptions } from "./model/group-filter-options.model";
import { ActivatedRoute } from "@angular/router";
import { GroupService } from "./groups.service";
import { GroupQuery } from "./model/group-query.model";
import { Group } from "./model/group.model";

@Component({
  selector: 'groups',
  templateUrl: './groups.component.html'
})
export class GroupsComponent implements OnInit {
  filterOptions: GroupFilterOptions;
  groups: Group[];
  query: GroupQuery;

  constructor(private route: ActivatedRoute, private service: GroupService) {
  }

  ngOnInit() {
    this.filterOptions = this.route.snapshot.data[ "filterOptions" ];

    this.query = new GroupQuery(this.filterOptions.subjects);

    this.query.school = this.filterOptions.schools[ 0 ];
    this.query.schoolYear = this.filterOptions.schoolYears[ 0 ];
    this.query.subject = this.filterOptions.subjects[ 0 ];

    this.updateResults();
  }

  updateResults() {
    this.service
      .getGroups(this.query)
      .subscribe(groups => {
        this.groups = groups;
      })
  }
}
