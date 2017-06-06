import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CachingDataService } from "../../shared/cachingData.service";
import { AssessmentExam } from "./model/assessment-exam.model";
import { FilterBy } from "./model/filter-by.model";
import { ExamFilterService } from "./exam-filter.service";
import { ExamFilter } from "./model/exam-filter.model";

@Component({
  selector: 'app-group-results',
  templateUrl: './group-results.component.html',
})
export class GroupResultsComponent implements OnInit {
  groups;
  availableSchoolYears;
  currentGroup;
  currentSchoolYear;
  showValuesAsPercent : boolean = true;
  expandFilterOptions : boolean = false;
  clientFilterBy : FilterBy;
  selectedAssessments : AssessmentExam[] = [];
  filters : any[] = [];

  get showAdvancedFilters(): boolean {
    return this._showAdvancedFilters;
  }

  set showAdvancedFilters(value: boolean) {
    this._showAdvancedFilters = value;
    this.expandFilterOptions = value; // Automatically expand / collapse filter options.
  }

  private _showAdvancedFilters : boolean = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private staticDataService: CachingDataService,
              private examFilterService : ExamFilterService) {
    this.clientFilterBy = new FilterBy()
  }

  ngOnInit() {
    this.groups = this.route.snapshot.data[ "groups" ];
    this.currentGroup = this.groups.find(x => x.id == this.route.snapshot.params[ "groupId" ]);
    this.examFilterService.getFilterDefinitions().forEach(filter => {
      this.filters[filter.name] = filter;
    });

    this.updateAssessment(this.route.snapshot.data[ "assessment" ]);

    this.staticDataService.getSchoolYears().subscribe(years => {
      this.availableSchoolYears = years;
      this.currentSchoolYear = this.mapParamsToSchoolYear(this.route.snapshot.params);
    });
  }

  removeEthnicity(ethnicity) {
    this.clientFilterBy.ethnicities[ethnicity] = false;
    if(this.clientFilterBy.filteredEthnicities.length == 0){
      this.clientFilterBy.ethnicities[0] = true; // None are selected, set all to true.
    }
  }

  removeFilter(filter) {
    if(filter == 'offGradeAssessment')
      this.clientFilterBy[filter] = false;
    else if(filter == 'ethnicities')
      this.clientFilterBy[filter] = [ -1 ];
    else
      this.clientFilterBy[filter] = -1;
  }

  updateAssessment(latestAssessment) {
    this.selectedAssessments = [];

    if (latestAssessment)
      this.selectedAssessments.push(latestAssessment);
  }

  updateRoute(event) {
    this.router.navigate([ 'groups', this.currentGroup.id, { schoolYear: this.currentSchoolYear } ]).then(() => {
      this.updateAssessment(this.route.snapshot.data[ "assessment" ]);
    });
  }

  mapParamsToSchoolYear(params) {
    return Number.parseInt(params[ "schoolYear" ]) || this.availableSchoolYears[ 0 ];
  }
}
