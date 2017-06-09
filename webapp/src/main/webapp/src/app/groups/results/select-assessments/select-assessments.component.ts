import { Component, OnInit, Input } from '@angular/core';
import { Assessment } from "../model/assessment.model";

@Component({
  selector: 'select-assessments',
  templateUrl: './select-assessments.component.html'
})
export class SelectAssessmentsComponent implements OnInit {

  grades : number[] = [ 3, 4, 5, 6, 7, 8, 9, 10 ]; // TODO: Data driven?
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

  constructor() {
  }

  ngOnInit() {
  }

  private groupAssessmentsByGrade() {
    let assessments = [];

    for(let grade of this.grades){
      let byGrade = this._assessments.filter(x => x.grade == grade);
      if(byGrade.length > 0){
        assessments.push({ grade: grade, assessments: byGrade });
      }
    }

    return assessments;
  }
}
