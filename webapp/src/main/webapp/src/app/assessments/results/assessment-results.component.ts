import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { animate, style, transition, trigger } from "@angular/animations";
import { AssessmentExam } from "../model/assessment-exam.model";
import { Exam } from "../model/exam.model";
import { ExamStatisticsCalculator } from "./exam-statistics-calculator";
import { FilterBy } from "../model/filter-by.model";
import { Observable, Subscription } from "rxjs";
import { ExamFilterService } from "../filters/exam-filters/exam-filter.service";
import { AssessmentItem } from "../model/assessment-item.model";
import { ordering } from "@kourge/ordering";
import { byString } from "@kourge/ordering/comparator";
import { Angulartics2 } from "angulartics2";
import { GradeCode } from "../../shared/enum/grade-code.enum";
import { ColorService } from "../../shared/color.service";
import { MenuActionBuilder } from "../menu/menu-action.builder";
import { ExamStatistics } from "../model/exam-statistics.model";
import { ItemPointField } from "../model/item-point-field.model";
import { StudentReportDownloadComponent } from "../../report/student-report-download.component";
import { AssessmentProvider } from "../assessment-provider.interface";

enum ScoreViewState {
  OVERALL = 1,
  CLAIM = 2
}

@Component({
  selector: 'assessment-results',
  templateUrl: './assessment-results.component.html',
  providers: [ MenuActionBuilder ],
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

  @ViewChild('menuReportDownloader')
  reportDownloader: StudentReportDownloadComponent;

  exams: Exam[] = [];
  sessions = [];
  statistics: ExamStatistics;
  pointColumns: ItemPointField[];
  showItemsByPoints: boolean = false;

  get hasItemLevelData(): boolean {
    return this._assessmentExam.exams.some(x => x.schoolYear > this.minimumItemDataYear);
  }

  /**
   * The assessment exam in which to display results for.
   */
  @Input()
  set assessmentExam(assessment: AssessmentExam) {
    this._assessmentExam = assessment;

    // if we aren't going to display the sessions, don't waste resources computing them
    if (this.allowFilterBySessions) {
      this.sessions = this.getDistinctExamSessions(assessment.exams);

      if (this.sessions.length > 0) {
        this.toggleSession(this.sessions[ 0 ]);
      }
    }
  }

  /**
   * Service class which provides assessment data for this assessment and exam.
   */
  @Input()
  assessmentProvider: AssessmentProvider;

  /**
   * If true, values will be shown as percents.  Otherwise values will be shown
   * as numbers.
   */
  @Input()
  showValuesAsPercent: boolean;

  /**
   * If true, the session toggles will be display with the most recent selected
   * by default.  Otherwise, they won't be displayed and all results will be shown.
   */
  @Input()
  allowFilterBySessions: boolean = true;

  /**
   * Represents the cutoff year for when there is no item level response data available.
   * If there are no exams that are after this school year, then disable the ability to go there and show proper message
   */
  @Input()
  minimumItemDataYear: number;

  @Input()
  displayState: any = {
    showClaim: ScoreViewState.OVERALL
  };

  /**
   * Exam filters applied, if any.
   */
  @Input()
  set filterBy(value: FilterBy) {
    this._filterBy = value;

    if (this._filterBySubscription) {
      this._filterBySubscription.unsubscribe();
    }

    if (this._filterBy) {
      this.updateExamSessions();

      this._filterBySubscription = this._filterBy.onChanges.subscribe(() => {
        this.updateExamSessions();
      });
    }
  }

  get assessmentExam() {
    return this._assessmentExam;
  }

  /**
   * Provider function which loads the assessment items when viewing
   * items by points earned.
   */
  @Input()
  loadAssessmentItems: (number) => Observable<AssessmentItem[]>;

  set collapsed(collapsed: boolean) {
    this.assessmentExam.collapsed = collapsed;
  }

  get collapsed() {
    return this.assessmentExam.collapsed;
  }

  get examLevelEnum() {
    return this.assessmentExam.assessment.isIab
      ? "enum.iab-category.full."
      : "enum.achievement-level.full.";
  }

  get isIab(): boolean {
    return this._assessmentExam.assessment.isIab;
  }

  private _filterBy: FilterBy;
  private _assessmentExam: AssessmentExam;
  private _filterBySubscription: Subscription;

  constructor(public colorService: ColorService,
              private examCalculator: ExamStatisticsCalculator,
              private examFilterService: ExamFilterService,
              private angulartics2: Angulartics2) {
  }

  ngOnInit(): void {
  }

  getGradeIdx(gradeCode: string): number {
    return GradeCode.getIndex(gradeCode);
  }

  getPointRowStyleClass(index: number) {
    return index == 0 ? 'level-down' : '';
  }

  toggleSession(session) {
    session.filter = !session.filter;
    this.updateExamSessions();
  }

  openInstructionalResource() {
    window.open(this.assessmentExam.assessment.resourceUrl);
  }

  viewItemsByPoints(viewItemsByPoints: boolean) {
    this.showItemsByPoints = viewItemsByPoints;

    this.angulartics2.eventTrack.next({
      action: (viewItemsByPoints ? 'View' : 'Hide') + 'ItemsByPointsEarned',
      properties: {
        category: 'AssessmentResults'
      }
    });
  }

  private getDistinctExamSessions(exams: Exam[]) {
    let sessions = [];

    for (let exam of exams) {
      if (!sessions.some(x => x.id == exam.session)) {
        sessions.push({ id: exam.session, date: exam.date, filter: false });
      }
    }

    return sessions
      .sort(ordering(byString)
        .on<any>(session => session.date)
        .reverse()
        .compare);
  }

  private updateExamSessions() {
    this.exams = this.filterExams();
    this.statistics = this.calculateStats();
  }

  private filterExams() {
    let exams: Exam[] = this.examFilterService
      .filterExams(this._assessmentExam, this._filterBy);

    // only filter by sessions if this is my groups, otherwise return all regardless of session
    if (this.allowFilterBySessions) {
      return exams.filter(x => this.sessions.some(y => y.filter && y.id == x.session));
    }

    return exams;
  }

  private calculateStats(): ExamStatistics {
    let stats = new ExamStatistics();
    stats.total = this.exams.length;
    stats.average = this.examCalculator.calculateAverage(this.exams);
    stats.standardError = this.examCalculator.calculateStandardErrorOfTheMean(this.exams);
    stats.levels = this.examCalculator.groupLevels(this.exams, this.isIab ? 3 : 4);
    stats.percents = this.examCalculator.mapGroupLevelsToPercents(stats.levels);

    return stats;
  }
}
