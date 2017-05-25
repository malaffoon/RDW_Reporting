import { Component, OnInit, Input } from "@angular/core";
import { trigger, transition, style, animate } from "@angular/animations";
import { AssessmentExam } from "./model/assessment-exam.model";
import { Exam } from "./model/exam.model";
import { ExamResultLevel } from "../../../shared/exam-result-level.enum";

@Component({
  selector: 'assessment-results',
  templateUrl: './assessment-results.component.html',
  animations: [
    trigger(
      'fadeAnimation',
      [
        transition(
          ':enter', [
            style({ opacity: 0 }),
            animate('500ms ease-in', style({ opacity: 1 }))
          ]
        ),
        transition(
          ':leave', [
            style({ opacity: 1 }),
            animate('500ms ease-out', style({ opacity: 0 }))
          ]
        )
      ]
    )
  ],
})

export class AssessmentResultsComponent implements OnInit {

  private _assessmentExam: AssessmentExam;
  private _exams = [];
  private _sessions = [];
  private _statistics: any = { percents: {} };
  private _showValuesAsPercent: boolean;

  @Input()
  set assessmentExam(assessment: AssessmentExam) {
    this._assessmentExam = assessment;
    this._sessions = this.getDistinctExamSessions(assessment.exams);

    if (this._sessions.length > 0)
      this.toggleSession(this._sessions[ 0 ]);
  }

  @Input()
  set showValuesAsPercent(value: boolean) {
    this._showValuesAsPercent = value;
  }

  get assessmentExam() {
    return this._assessmentExam;
  }

  get exams() {
    return this._exams;
  }

  get sessions() {
    return this._sessions;
  }

  get statistics() {
    return this._statistics;
  }

  get performance() {
    if (this._showValuesAsPercent)
      return this._statistics.percents;
    else
      return this._statistics;
  }

  ngOnInit() {
  }

  toggleSession(session) {
    session.filter = !session.filter;
    this.updateExamSessions();
  }

  private getDistinctExamSessions(exams: Exam[]) {
    let sessions = [];

    exams.forEach(exam => {
      if (!sessions.some(x => x.id == exam.session)) {
        sessions.push({ id: exam.session, date: exam.date, filter: false });
      }
    });

    return sessions;
  }

  private updateExamSessions() {
    this._exams = this._assessmentExam.exams.filter(x => this.sessions.some(y => y.filter && y.id == x.session));
    this._statistics = this.calculateStats();
  }

  private calculateStats() {
    let stats: any = {
      total: this._exams.length,
      average: this._exams.reduce((x, y) => x + y.score, 0) / this._exams.length,
      belowStandard: this._exams.filter(x => x.level == ExamResultLevel.BelowStandard).length,
      nearStandard: this._exams.filter(x => x.level == ExamResultLevel.NearStandard).length,
      aboveStandard: this._exams.filter(x => x.level == ExamResultLevel.AboveStandard).length,
    };

    stats.percents = {
      belowStandard: stats.belowStandard / stats.total * 100,
      nearStandard: stats.nearStandard / stats.total * 100,
      aboveStandard: stats.aboveStandard / stats.total * 100
    };

    return stats;
  }
}
