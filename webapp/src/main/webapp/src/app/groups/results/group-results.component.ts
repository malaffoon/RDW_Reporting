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

  private selectedAssessments = [];

  constructor(private route: ActivatedRoute, private router: Router, private staticDataService: StaticDataService) {
  }

  ngOnInit() {
    this.groups = this.route.snapshot.data[ "groups" ];
    this.currentGroup = this.groups.find(x => x.id == this.route.snapshot.params[ "groupId" ]);
    this.selectedAssessments = this.route.snapshot.data[ "assessments" ];

    this.staticDataService.getSchoolYears().subscribe(years => {
      this.availableSchoolYears = years.map(x => x.id);
    });
  }

  onCurrentGroupChange(event) {
    this.router.navigate([ 'groups', this.currentGroup.id ]);
  }
}
