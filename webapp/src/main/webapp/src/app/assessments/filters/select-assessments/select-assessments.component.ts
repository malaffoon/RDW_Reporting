import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Assessment } from '../../model/assessment';
import { uniq } from 'lodash';
import { gradeColor } from '../../../shared/colors';

@Component({
  selector: 'select-assessments',
  templateUrl: './select-assessments.component.html'
})
export class SelectAssessmentsComponent {
  readonly gradeColor = gradeColor;

  assessmentsByGrade: any[] = [];

  @Input()
  set assessments(value: Assessment[]) {
    this._assessments = value;
    this.assessmentsByGrade = this.groupAssessmentsByGrade();
  }

  get assessments(): Assessment[] {
    return this._assessments;
  }

  @Output()
  selectedAssessmentsChanged: EventEmitter<Assessment> = new EventEmitter();

  private _assessments: Assessment[];

  toggleSelectedAssessment(assessment: Assessment) {
    if (assessment.selected) {
      this.deselectAssessment(assessment);
    } else {
      assessment.selected = true;
      this.selectedAssessmentsChanged.emit(assessment);
    }
  }

  private deselectAssessment(assessment: Assessment) {
    let count = 0;
    this._assessments.forEach(asmt => {
      if (asmt.selected) {
        count++;
        if (count > 1) return;
      }
    });
    if (count > 1) {
      assessment.selected = false;
      this.selectedAssessmentsChanged.emit(assessment);
    }
  }

  private groupAssessmentsByGrade() {
    const assessmentsByGrade = [];

    const grades: string[] = uniq(
      this._assessments.map(assessment => assessment.grade)
    ).sort((a, b) => a.localeCompare(b));

    for (let grade of grades) {
      const assessments = this._assessments.filter(x => x.grade == grade);

      if (assessments.length > 0) {
        assessmentsByGrade.push({ grade: grade, assessments: assessments });
      }
    }

    return assessmentsByGrade;
  }
}
