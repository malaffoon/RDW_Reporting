import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AssessmentExam } from "../../assessments/model/assessment-exam.model";
import { ExamFilterOptions } from "../../assessments/model/exam-filter-options.model";
import { Assessment } from "../../assessments/model/assessment.model";
import { ExamFilterOptionsService } from "../../assessments/filters/exam-filters/exam-filter-options.service";
import { SchoolAssessmentService } from "./school-assessment.service";
import { School } from "../../user/model/school.model";

@Component({
  selector: 'app-group-results',
  templateUrl: './school-results.component.html',
})
export class SchoolResultsComponent implements OnInit {
  schools;
  assessmentExams: AssessmentExam[] = [];
  availableAssessments: Assessment[] = [];
  assessmentsLoading: any[] = [];
  filterOptions: ExamFilterOptions = new ExamFilterOptions();
  private _currentSchool: School;
  private _currentGradeId: number;

  get currentSchool(){
    return this._currentSchool;
  }

  set currentSchool(value) {
    this._currentSchool = value;
    this.assessmentProvider.schoolId = value.id;
  }

  get currentGradeId(){
    return this._currentGradeId;
  }

  set currentGradeId(value) {
    this._currentGradeId = value;
    this.assessmentProvider.gradeId = value;
  }

  get currentSchoolYear() {
    return this._currentSchoolYear;
  }

  set currentSchoolYear(value) {
    this._currentSchoolYear = value;
    this.assessmentProvider.schoolYear = value;
  }

  get selectedAssessments() {
    return this.availableAssessments.filter(x => x.selected);
  }

  private _currentGroup;
  private _currentSchoolYear;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private filterOptionService: ExamFilterOptionsService,
              public assessmentProvider: SchoolAssessmentService) {
  }

  ngOnInit() {
    this.schools = this.route.snapshot.data[ "user" ].schools;
    this.currentSchool = this.schools.find(x => x.id == this.route.snapshot.params[ "schoolId" ]);
    this.currentGradeId = this.route.snapshot.params[ "gradeId" ];

    this.filterOptionService.getExamFilterOptions().subscribe(filterOptions => {
      this.filterOptions = filterOptions;
      this.currentSchoolYear = this.mapParamsToSchoolYear(this.route.snapshot.params);
    });

    this.updateAssessment(this.route.snapshot.data[ "assessment" ]);
  }

  updateAssessment(latestAssessment) {
    this.assessmentExams = [];

    if (latestAssessment) {
      this.assessmentExams.push(latestAssessment);
    }
  }

  updateRoute() {
    this.router.navigate([ 'groups', this._currentGroup.id, { schoolYear: this._currentSchoolYear, } ]).then(() => {
      this.updateAssessment(this.route.snapshot.data[ "assessment" ]);
    });
  }

  mapParamsToSchoolYear(params) {
    return Number.parseInt(params[ "schoolYear" ]) || this.filterOptions.schoolYears[ 0 ];
  }
}
