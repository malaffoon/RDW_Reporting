import { Component, OnInit, Input } from '@angular/core';
import { Assessment } from "../model/assessment.model";
import { GradeService } from "../../../shared/grade.service";
import { Grade } from "../../../shared/model/grade.model";

@Component({
  selector: 'select-assessments',
  templateUrl: './select-assessments.component.html'
})
export class SelectAssessmentsComponent implements OnInit {

  grades : Grade[] = [];
  assessmentsByGrade : any[] = [];

  @Input()
  set assessments(value: Assessment[]) {
    this._assessments = value;
    this.assessmentsByGrade = this.groupAssessmentsByGrade();
  }

  get assessments(): Assessment[] {
    return this._assessments;
  }

  private _assessments: Assessment[];

  constructor(private gradeService : GradeService) {
  }

  ngOnInit() {
    this.grades = this.gradeService.getGrades();
  }

  private groupAssessmentsByGrade() {
    let assessmentsByGrade = [];

    for(let grade of this.grades){
      let assessments = this._assessments.filter(x => x.grade == grade.id);
      if(assessments.length > 0){
        assessmentsByGrade.push({ grade: grade, assessments: assessments });
      }
    }

    return assessmentsByGrade;
  }

  selectedAssessmentChanged(event){
    console.log(event);

    let selectedAssessments = this._assessments.filter(x => x.selected);
    console.log(selectedAssessments);

  }
}
