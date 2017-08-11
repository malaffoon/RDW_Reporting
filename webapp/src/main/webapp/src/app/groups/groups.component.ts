import { Component, OnInit } from "@angular/core";
import { GroupFilterOptions } from "./model/group-filter-options.model";
import { ActivatedRoute, Router } from "@angular/router";
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

  constructor(private route: ActivatedRoute,
              private router: Router,
              private service: GroupService) {
  }

  ngOnInit() {
    this.filterOptions = this.route.snapshot.data[ "filterOptions" ];

    this.query = new GroupQuery(this.filterOptions.subjects);
    let params: any = this.route.snapshot.params;

    if(this.filterOptions.schools.length > 0) {
      this.query.school = this.filterOptions.schools.find(school => school.id == params.schoolId) || this.filterOptions.schools[ 0 ];
    }

    this.query.schoolYear = +params.schoolYear || this.filterOptions.schoolYears[ 0 ];
    this.query.subject =  params.subject || this.filterOptions.subjects[ 0 ];

    this.updateResults();
  }

  updateRoute() {
    let params = {
      schoolId: this.query.school.id,
      schoolYear: this.query.schoolYear,
      subject: this.query.subject
    };

    this.router.navigate([ params ], { relativeTo: this.route }).then(() => {
      this.updateResults();
    });
  }

  updateResults() {
    this.service
      .getGroups(this.query)
      .subscribe(groups => {
        this.groups = groups;
      })
  }
}
