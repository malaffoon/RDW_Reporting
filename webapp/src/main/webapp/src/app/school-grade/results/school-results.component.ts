import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AssessmentExam } from "../../assessments/model/assessment-exam.model";
import { ExamFilterOptions } from "../../assessments/model/exam-filter-options.model";
import { Assessment } from "../../assessments/model/assessment.model";
import { ExamFilterOptionsService } from "../../assessments/filters/exam-filters/exam-filter-options.service";
import { SchoolAssessmentService } from "./school-assessment.service";
import { School } from "../../user/model/school.model";
import { SchoolService } from "../school.service";
import { Grade } from "../grade.model";
import { isNullOrUndefined } from "util";

@Component({
  selector: 'app-group-results',
  templateUrl: './school-results.component.html',
})
export class SchoolResultsComponent implements OnInit {
  schools;
  assessmentExams: AssessmentExam[] = [];
  availableAssessments: Assessment[] = [];

  availableGrades: Grade[];
  assessmentsLoading: any[] = [];
  filterOptions: ExamFilterOptions = new ExamFilterOptions();
  private _currentSchool: School;
  private _currentGrade: Grade;

  get currentSchool() {
    return this._currentSchool;
  }

  set currentSchool(value) {
    this._currentSchool = value;
    this.assessmentProvider.schoolId = value.id;
  }

  get currentGrade() {
    return this._currentGrade;
  }

  set currentGrade(value: Grade) {
    this._currentGrade = value;
    this.assessmentProvider.gradeId = value.id;
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

  private _currentSchoolYear;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private filterOptionService: ExamFilterOptionsService,
              private schoolService: SchoolService,
              public assessmentProvider: SchoolAssessmentService) {
  }

  ngOnInit() {
    this.schools = this.route.snapshot.data[ "user" ].schools;
    let schoolId = this.route.snapshot.params[ "schoolId" ];

    this.currentSchool = this.schools.find(x => x.id == schoolId);

    this.filterOptionService
      .getExamFilterOptions()
      .subscribe(filterOptions => {
        this.filterOptions = filterOptions;
        this.currentSchoolYear = this.mapParamsToSchoolYear(this.route.snapshot.params);
      });

    this.schoolService
      .findGradesWithAssessmentsForSchool(this.currentSchool)
      .subscribe(grades => {
        this.availableGrades = grades;
        this.currentGrade = this.availableGrades.find(grade => grade.id == this.route.snapshot.params[ "gradeId" ]);
      });

    this.updateAssessment(this.route.snapshot.data[ "assessment" ]);
  }

  updateAssessment(latestAssessment) {
    this.assessmentExams = [];

    if (latestAssessment) {
      this.assessmentExams.push(latestAssessment);
    }
  }

  schoolSelectChanged(){
    this.schoolService
      .findGradesWithAssessmentsForSchool(this.currentSchool)
      .subscribe(grades => {
        this.availableGrades = grades;

        if(grades.length > 0){
          let grade = this.availableGrades.find(grade => grade.id == this.currentGrade.id);

          this.currentGrade = isNullOrUndefined(grade)
            ? grades[0]
            : grade;
        }

        this.updateRoute();
      });
  }

  updateRoute() {

    this.router.navigate([
      'schools',
      this.currentSchool.id, {
        gradeId: this.currentGrade.id,
        schoolYear: this.currentSchoolYear,
      } ]).then(() => {
      this.updateAssessment(this.route.snapshot.data[ "assessment" ]);
    });
  }

  mapParamsToSchoolYear(params) {
    return Number.parseInt(params[ "schoolYear" ]) || this.filterOptions.schoolYears[ 0 ];
  }

  private loadAvailableGrades(school: School) {

  }
}
