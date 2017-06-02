import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CachingDataService } from "../../shared/cachingData.service";
import { AssessmentExam } from "./model/assessment-exam.model";
import { FilterBy } from "./model/filter-by.model";

@Component({
  selector: 'app-group-results',
  templateUrl: './group-results.component.html',
})
export class GroupResultsComponent implements OnInit {
  private _groups;
  private _availableSchoolYears;
  private _currentGroup;
  private _showValuesAsPercent : boolean = true;
  private _showAdvancedFilters : boolean = true; // TODO: Set back to false
  private _expandFilterOptions : boolean = true; // TODO: Set back to false
  private _translateFilters = {
    offGradeAssessment : { label: 'labels.groups.results.adv-filters.test.off-grade-assessment', val: 'enum.off-grade' },
    administration : { label: 'labels.groups.results.adv-filters.status.administration', val: 'enum.administrative-condition' },
    summativeStatus : { label: 'labels.groups.results.adv-filters.status.summative', val: 'enum.administrative-condition' },
    completion : { label: 'labels.groups.results.adv-filters.status.completion', val: 'enum.completeness' },
    gender : { label: 'labels.groups.results.adv-filters.student.gender', val: 'enum.gender' },
    migrantStatus : { label: 'labels.groups.results.adv-filters.student.migrant-status', val: 'enum.polar' },
    plan504 : { label: 'labels.groups.results.adv-filters.student.504-plan', val: 'enum.polar' },
    iep : { label: 'labels.groups.results.adv-filters.student.iep', val: 'enum.polar' },
    economicDisadvantage : { label: 'labels.groups.results.adv-filters.student.economic-disadvantage', val: 'enum.polar' },
    limitedEnglishProficiency : { label: 'labels.groups.results.adv-filters.student.limited-english-proficiency', val: 'enum.polar' },
  };

  get showValuesAsPercent(): boolean {
    return this._showValuesAsPercent;
  }

  set showValuesAsPercent(value: boolean) {
    this._showValuesAsPercent = value;
  }

  private _filterBy = { schoolYear: 0 };
  private _clientFilterBy : FilterBy;

  get clientFilterBy(): FilterBy {
    return this._clientFilterBy;
  }

  set clientFilterBy(value: FilterBy) {
    this._clientFilterBy = value;
  }

  get groups() {
    return this._groups;
  }

  get availableSchoolYears() {
    return this._availableSchoolYears;
  }

  get currentGroup() {
    return this._currentGroup;
  }

  set currentGroup(value) {
    this._currentGroup = value;
  }

  get filterBy(): { schoolYear: number } {
    return this._filterBy;
  }

  set filterBy(value: { schoolYear: number }) {
    this._filterBy = value;
  }

  get selectedAssessments(): AssessmentExam[] {
    return this._selectedAssessments;
  }

  get showAdvancedFilters(): boolean {
    return this._showAdvancedFilters;
  }

  set showAdvancedFilters(value: boolean) {
    this._showAdvancedFilters = value;
    this._expandFilterOptions = value; // Automatically expand / collapse filter options.
  }

  get expandFilterOptions(): boolean {
    return this._expandFilterOptions;
  }

  set expandFilterOptions(value: boolean) {
    this._expandFilterOptions = value;
  }

  get translateFilters() {
    return this._translateFilters;
  }

  private _selectedAssessments : AssessmentExam[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private staticDataService: CachingDataService) {
    this._clientFilterBy = new FilterBy()
  }

  ngOnInit() {
    this._groups = this.route.snapshot.data[ "groups" ];
    this._currentGroup = this._groups.find(x => x.id == this.route.snapshot.params[ "groupId" ]);

    this.updateAssessment(this.route.snapshot.data[ "assessment" ]);

    this.staticDataService.getSchoolYears().subscribe(years => {
      this._availableSchoolYears = years;
      this._filterBy = this.mapParamsToFilterBy(this.route.snapshot.params);
    });
  }

  updateAssessment(latestAssessment) {
    this._selectedAssessments = [];

    if (latestAssessment)
      this._selectedAssessments.push(latestAssessment);
  }

  updateRoute(event) {
    this.router.navigate([ 'groups', this._currentGroup.id, { schoolYear: this._filterBy.schoolYear } ]).then(() => {
      this.updateAssessment(this.route.snapshot.data[ "assessment" ]);
    });
  }

  mapParamsToFilterBy(params) {
    return {
      schoolYear: Number.parseInt(params[ "schoolYear" ]) || this._availableSchoolYears[ 0 ]
    }
  }
}
