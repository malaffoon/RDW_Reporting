import { Component, OnInit, Input } from "@angular/core";
import { trigger, transition, style, animate } from "@angular/animations";
import { AssessmentExam } from "./model/assessment-exam.model";
import { Exam } from "./model/exam.model";

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

  private _assessmentExam : AssessmentExam;
  private _exams = [];
  private _sessions = [];

  @Input()
  set assessmentExam(assessment) {
    this._assessmentExam = assessment;
    this._sessions = this.getDistinctExamSessions(assessment.exams);

    if(this._sessions.length > 0)
      this.toggleSession(this._sessions[0]);
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

  ngOnInit() {
  }

  toggleSession(session) {
    session.filter = !session.filter;
    this.updateExamSessions();
  }

  private getDistinctExamSessions(exams : Exam[]) {
    let sessions = [];

    exams.forEach(exam => {
      if(!sessions.some(x => x.id == exam.session)){
        sessions.push({ id: exam.session, date: exam.date, filter: false });
      }
    });

    return sessions;
  }

  private updateExamSessions() {
    this._exams = this._assessmentExam.exams.filter(x => this.sessions.some(y => y.filter && y.id == x.session));
  }
}
