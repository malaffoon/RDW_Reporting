import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: 'assessment-results',
  templateUrl: './assessment-results.component.html'
})

export class AssessmentResultsComponent implements OnInit {
  private _assessment;
  private _examSessions = [];

  @Input()
  set assessment(assessment) {
    this._assessment = assessment;

    if (this._assessment.sessions && this._assessment.sessions.length > 0) {
      // Select the first session by default.
      this._assessment.sessions[ 0 ].filter = true;
      this.updateExamSessions(this._assessment.sessions[ 0 ]);
    }
  }

  get assessment() {
    return this._assessment;
  }

  get examSessions() {
    return this._examSessions;
  }

  ngOnInit() {
  }

  toggleSession(session) {
    session.filter = !session.filter;
    this.updateExamSessions(session);
  }

  private updateExamSessions(session) {
    // create copy
    let examSessions = this._examSessions.filter(x => true);

    if (session.filter)
      session.exams.forEach(x => examSessions.push({ session: session, exam: x }));
    else
      session.exams.forEach(x => examSessions.splice(examSessions.findIndex(y => y.exam == x), 1))

    this._examSessions = examSessions;
  }
}
