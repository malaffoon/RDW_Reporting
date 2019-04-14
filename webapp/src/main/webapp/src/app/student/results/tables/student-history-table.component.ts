import { Component, Input, OnInit } from '@angular/core';
import { MenuActionBuilder } from '../../../assessments/menu/menu-action.builder';
import { StudentHistoryExamWrapper } from '../../model/student-history-exam-wrapper.model';
import { Student } from '../../model/student.model';
import { Observable } from 'rxjs';
import { InstructionalResourcesService } from '../../../shared/service/instructional-resources.service';
import { InstructionalResource } from '../../../shared/model/instructional-resource';
import { TranslateService } from '@ngx-translate/core';
import { chunk } from 'lodash';
import { StudentResultsFilterService } from '../student-results-filter.service';
import { ScoreType } from '../../../exam/model/score-statistics';
import { Option } from '../../../shared/form/option';
import { SubjectDefinition } from '../../../subject/subject';

function createScoreTypeOptions(
  subjectDefinition: SubjectDefinition,
  translateService: TranslateService
): Option[] {
  const options = [
    {
      value: 'Overall',
      text: translateService.instant('common.buttons.display-overall'),
      analyticsProperties: {
        label: 'Score Type: Overall'
      }
    }
  ];
  if (subjectDefinition.alternateScore != null) {
    options.push({
      value: 'Alternate',
      text: translateService.instant(
        `subject.${subjectDefinition.subject}.asmt-type.${
          subjectDefinition.assessmentType
        }.alt-score.name`
      ),
      analyticsProperties: {
        label: 'Score Type: Alternate'
      }
    });
  }
  if (subjectDefinition.claimScore != null) {
    options.push({
      value: 'Claim',
      text: translateService.instant(
        `subject.${subjectDefinition.subject}.asmt-type.${
          subjectDefinition.assessmentType
        }.claim-score.name`
      ),
      analyticsProperties: {
        label: 'Score Type: Claim'
      }
    });
  }
  return options;
}

@Component({
  selector: 'student-history-table',
  providers: [MenuActionBuilder],
  templateUrl: 'student-history-table.component.html'
})
export class StudentHistoryTableComponent implements OnInit {
  private _exams: StudentHistoryExamWrapper[] = [];

  @Input()
  student: Student;

  @Input()
  subject: string;

  @Input()
  subjectDefinitions: SubjectDefinition[];

  /**
   * Represents the cutoff year for when there is no item level response data available.
   * If there are no exams that are after this school year, then disable the ability to go there and show proper message
   */
  @Input()
  minimumItemDataYear: number;

  private originalExams: StudentHistoryExamWrapper[] = [];
  scoreType: ScoreType = 'Overall';
  instructionalResourcesProvider: () => Observable<InstructionalResource[]>;
  selectedCardRowIndex: number;
  itemsPerRow: number = 3;
  rows: StudentHistoryExamWrapper[][] = [];
  scoreTypeOptions: Option[] = [];
  studentHistoryCards: StudentHistoryExamWrapper[] = [];

  /**
   * The selected card's subject definition
   */
  subjectDefinition: SubjectDefinition;

  constructor(
    private actionBuilder: MenuActionBuilder,
    private instructionalResourcesService: InstructionalResourcesService,
    private translateService: TranslateService,
    private studentResultsFilterService: StudentResultsFilterService
  ) {}

  ngOnInit(): void {
    // TODO this should be passed in
    this.studentResultsFilterService.filterChange.subscribe(() => {
      delete this.selectedCardRowIndex;
    });
  }

  get exams(): StudentHistoryExamWrapper[] {
    return this._exams;
  }

  @Input()
  set exams(exams: StudentHistoryExamWrapper[]) {
    this._exams = exams;
    this.originalExams = Array.from(exams);
    this.studentHistoryCards = this.getLatestStudentHistoryCards();
    this.rows = chunk(this.studentHistoryCards, this.itemsPerRow);
  }

  private updateSelectedCardRowIndex(): void {
    const selectedCardIndex = this.studentHistoryCards.indexOf(
      this.studentHistoryCards.find(
        studentHistoryCard => studentHistoryCard.selected
      )
    );

    if (selectedCardIndex < 0) {
      delete this.selectedCardRowIndex;
    }
    this.selectedCardRowIndex = Math.floor(
      selectedCardIndex / this.itemsPerRow
    );
  }

  // TODO why is this here and not in the "parent" component???
  onCardSelection(event: StudentHistoryExamWrapper) {
    const prevSelected = event.selected;
    this.subjectDefinition = this.subjectDefinitions.find(
      ({ subject, assessmentType }) =>
        subject === event.assessment.subject &&
        assessmentType === event.assessment.type
    );
    this.scoreTypeOptions = createScoreTypeOptions(
      this.subjectDefinition,
      this.translateService
    );

    this.studentHistoryCards.forEach(
      studentHistoryCard => (studentHistoryCard.selected = false)
    );
    event.selected = !prevSelected;
    this.scoreType = 'Overall';

    this._exams = Array.from(this.originalExams);
    this._exams = this.exams.filter(
      exam => exam.assessment.label === event.assessment.label
    );

    this.updateSelectedCardRowIndex();
  }

  getLatestStudentHistoryCards(): StudentHistoryExamWrapper[] {
    const returnExams = [];
    const assessmentTitles = new Set(
      this.exams.map(exam => exam.assessment.label)
    );
    assessmentTitles.forEach(title => {
      // get the most recent exam
      const examsByTitle = this.exams
        .filter(exam => exam.assessment.label === title && exam.exam.date)
        .sort((a, b) => (a.exam.date >= b.exam.date ? -1 : 1))[0];

      returnExams.push(examsByTitle);
    });

    // deselect all cards
    // TODO consider maintaining selected state across filter application
    returnExams.forEach(
      (exam: StudentHistoryExamWrapper) => (exam.selected = false)
    );
    delete this.selectedCardRowIndex;

    return returnExams;
  }
}
