import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { StaticDataService } from "../../shared/staticData.service";

@Component({
  selector: 'app-group-results',
  templateUrl: './group-results.component.html',
})
export class GroupResultsComponent implements OnInit {
  private groups;
  private availableSchoolYears;
  private currentGroup;
  private filterBy;

  private selectedAssessments = [];

  constructor(private route: ActivatedRoute, private router: Router, private staticDataService: StaticDataService) {
  }

  ngOnInit() {
    this.groups = this.route.snapshot.data[ "groups" ];
    this.currentGroup = this.groups.find(x => x.id == this.route.snapshot.params[ "groupId" ]);
    this.selectedAssessments = this.route.snapshot.data[ "assessments" ];

    this.staticDataService.getSchoolYears().subscribe(years => {
      this.availableSchoolYears = years;
      this.filterBy = this.mapParamsToFilterBy(this.route.snapshot.params);
    });
  }

  updateRoute(event) {
    this.router.navigate([ 'groups', this.currentGroup.id, { schoolYear: this.filterBy.schoolYear } ]).then(() => {
      this.selectedAssessments = this.route.snapshot.data[ "assessments" ];
    });
  }

  private mapParamsToFilterBy(params) {
    return {
      schoolYear: Number.parseInt(params[ "schoolYear" ]) || this.availableSchoolYears.find(x => x.isCurrent).id
    }
  }
}
