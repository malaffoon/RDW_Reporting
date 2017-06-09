import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AssessmentExam } from "./model/assessment-exam.model";
import { FilterBy } from "./model/filter-by.model";
import { ExamFilterService } from "./exam-filters/exam-filter.service";
import { ExamFilterOptionsService } from "./exam-filters/exam-filter-options.service";
import { ExamFilterOptions } from "./model/exam-filter-options.model";
import { Assessment } from "./model/assessment.model";
import { AssessmentService } from "./assessment/assessment.service";

@Component({
  selector: 'app-group-results',
  templateUrl: './group-results.component.html',
})
export class GroupResultsComponent implements OnInit {
  groups;
  currentGroup;
  currentSchoolYear;
  showValuesAsPercent: boolean = true;
  expandFilterOptions: boolean = false;
  clientFilterBy: FilterBy;
  selectedAssessments: AssessmentExam[] = [];
  filters: any[] = [];
  filterOptions: ExamFilterOptions = new ExamFilterOptions();
  currentFilters = [];
  availableAssessments: Assessment[] = [];

  get showAdvancedFilters(): boolean {
    return this._showAdvancedFilters;
  }

  set showAdvancedFilters(value: boolean) {
    this._showAdvancedFilters = value;
    this.expandFilterOptions = value; // Automatically expand / collapse filter options.
  }

  get expandAssessments(): boolean {
    return this._expandAssessments;
  }

  set expandAssessments(value: boolean) {
    this._expandAssessments = value;
    if(value && this.availableAssessments.length == 0) {
      this.assessmentService.getAvailableAssessments(this.currentGroup.id, this.currentSchoolYear).subscribe(result =>{
        this.availableAssessments = result;
      })
    }
  }

  private _showAdvancedFilters : boolean = false;
  private _expandAssessments: boolean = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private filterOptionService: ExamFilterOptionsService,
              private examFilterService: ExamFilterService,
              private assessmentService: AssessmentService) {
    this.clientFilterBy = new FilterBy()
  }

  ngOnInit() {
    this.groups = this.route.snapshot.data[ "groups" ];
    this.currentGroup = this.groups.find(x => x.id == this.route.snapshot.params[ "groupId" ]);
    this.examFilterService.getFilterDefinitions().forEach(filter => {
      this.filters[filter.name] = filter;
    });

    this.updateAssessment(this.route.snapshot.data[ "assessment" ]);

    this.filterOptionService.getExamFilterOptions().subscribe(filterOptions => {
      this.filterOptions = filterOptions;
      this.currentSchoolYear = this.mapParamsToSchoolYear(this.route.snapshot.params);
    });
  }

  removeEthnicity(ethnicity) {
    this.clientFilterBy.ethnicities[ethnicity] = false;
    if(this.clientFilterBy.filteredEthnicities.length == 0){
      this.clientFilterBy.ethnicities[0] = true; // None are selected, set all to true.
    }

    this.clientFilterBy.ethnicities = Object.assign({}, this.clientFilterBy.ethnicities);
  }

  removeFilter(property) {
    if(property == 'offGradeAssessment'){
      this.clientFilterBy[property] = false;
    }
    else if(property.indexOf('ethnicities') > -1) {
      this.removeEthnicity(property.substring(property.indexOf('.') + 1));
    }
    else{
      this.clientFilterBy[property] = -1;
    }
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
    return Number.parseInt(params[ "schoolYear" ]) || this.filterOptions.schoolYears[ 0 ];
  }

  log(val){
    console.log(val);
  }
}
