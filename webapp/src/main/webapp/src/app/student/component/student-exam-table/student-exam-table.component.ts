import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ordering } from '@kourge/ordering';
import { map } from 'rxjs/internal/operators';
import { Router } from '@angular/router';
import { ranking } from '@kourge/ordering/comparator';
import { StudentPipe } from '../../../shared/format/student.pipe';
import { StudentHistoryExamWrapper } from '../../model/student-history-exam-wrapper.model';
import { Student } from '../../model/student.model';
import { ScoreType } from '../../../exam/model/score-statistics';
import { Assessment } from '../../../assessments/model/assessment';
import { Exam } from '../../../assessments/model/exam';
import { SubjectDefinition } from '../../../subject/subject';
import { PopupMenuAction } from '../../../shared/menu/popup-menu-action.model';
import { InstructionalResource } from '../../../shared/model/instructional-resource';
import { MenuActionBuilder } from '../../../assessments/menu/menu-action.builder';
import { InstructionalResourcesService } from '../../../shared/service/instructional-resources.service';

class Column {
  id: string;
  field: string;
  commonHeader: boolean;
  headerInfo: boolean;
  scoreType: ScoreType;

  // Claim properties
  index?: number;
  // The claim or alt score code
  code?: string;

  constructor({
    id,
    field = '',
    commonHeader = false,
    headerInfo = false,
    index = -1,
    scoreType = undefined,
    code = ''
  }) {
    this.id = id;
    this.field = field ? field : id;
    this.commonHeader = commonHeader;
    this.headerInfo = headerInfo;
    if (index >= 0) {
      this.index = index;
    }
    this.scoreType = scoreType;
    if (code) {
      this.code = code;
    }
  }
}

function createAlternateScoreColumns(scoreCodes: string[]): Column[] {
  const columns = [];
  scoreCodes.forEach((code, index) => {
    const commonFields: Partial<Column> = {
      scoreType: 'Alternate',
      index,
      code
    };
    columns.push(
      new Column({
        ...commonFields,
        id: `alternateScaleScoreLevel`,
        field: `exam.alternateScaleScores.${index}.level`
      }),
      new Column({
        ...commonFields,
        id: `alternateScaleScore`,
        field: `exam.alternateScaleScores.${index}.score`
      })
    );
  });
  return columns;
}

function createClaimColumns(scoreCodes: string[]): Column[] {
  return scoreCodes.map(
    (code, index) =>
      new Column({
        id: `claim`,
        field: `exam.claimScaleScores.${index}.level`,
        scoreType: 'Claim',
        index,
        code
      })
  );
}

@Component({
  selector: 'student-exam-table',
  templateUrl: './student-exam-table.component.html'
})
export class StudentExamTableComponent implements OnInit {
  @Input()
  student: Student;

  /**
   * The exams to display
   */
  @Input()
  exams: Exam[];

  /**
   * Represents the cutoff year for when there is no item level response data available.
   * If there are no exams that are after this school year, then disable the ability to go there and show proper message
   */
  @Input()
  minimumItemDataYear: number;

  @Input()
  scoreType: ScoreType;

  @Input()
  subjectDefinition: SubjectDefinition;

  columns: Column[];
  actions: PopupMenuAction[];
  instructionalResourcesProvider: () => Observable<InstructionalResource[]>;

  constructor(
    private actionBuilder: MenuActionBuilder,
    private translate: TranslateService,
    private studentPipe: StudentPipe,
    private router: Router,
    private instructionalResourcesService: InstructionalResourcesService
  ) {}

  ngOnInit(): void {
    const { subjectDefinition } = this;
    this.columns = [
      new Column({ id: 'date', field: 'exam.date' }),
      new Column({ id: 'assessment', field: 'assessment.label' }),
      new Column({ id: 'school-year', field: 'exam.schoolYear' }),
      new Column({ id: 'school', field: 'exam.school.name' }),
      new Column({ id: 'enrolled-grade', field: 'exam.enrolledGrade' }),
      ...(subjectDefinition.alternateScore != null
        ? createAlternateScoreColumns(subjectDefinition.alternateScore.codes)
        : []),
      ...(subjectDefinition.claimScore != null
        ? createClaimColumns(subjectDefinition.claimScore.codes)
        : []),
      new Column({
        id: 'status',
        commonHeader: true,
        field: 'exam.administrativeCondition',
        scoreType: 'Overall'
      }),
      new Column({
        id: 'performance',
        field: 'exam.level',
        scoreType: 'Overall'
      }),
      new Column({
        id: 'score',
        commonHeader: true,
        field: 'exam.score',
        scoreType: 'Overall'
      })
    ];
    this.actions = this.createActions();
  }

  private createActions(): PopupMenuAction[] {
    if (this.subjectDefinition.assessmentType === 'sum') {
      const menuAction: PopupMenuAction = new PopupMenuAction();
      menuAction.displayName = () => {
        return this.translate.instant('common.menus.responses', {
          name: this.studentPipe.transform(this.student, true)
        });
      };
      menuAction.tooltip = () => {
        return this.translate.instant(
          'common.messages.no-responses-for-summative-exams'
        );
      };
      menuAction.isDisabled = () => {
        return true;
      };
      return [menuAction];
    }

    const builder: MenuActionBuilder = this.actionBuilder
      .newActions()
      .withResponses(
        ({ exam }) => exam.id,
        () => this.student,
        ({ exam }) => exam.schoolYear > this.minimumItemDataYear
      );
    if (this.subjectDefinition.assessmentType === 'iab') {
      builder.withShowResources(
        this.loadAssessmentInstructionalResources.bind(this)
      );
    }
    return builder.build();
  }

  loadAssessmentInstructionalResources({
    assessment,
    exam
  }: StudentHistoryExamWrapper): Observable<InstructionalResource[]> {
    return this.instructionalResourcesService
      .getInstructionalResources(assessment.id, exam.school.id)
      .pipe(map(resources => resources.getResourcesByPerformance(0)));
  }

  loadInstructionalResources({
    assessment,
    exam
  }: StudentHistoryExamWrapper): void {
    this.instructionalResourcesProvider = () =>
      this.instructionalResourcesService
        .getInstructionalResources(assessment.id, exam.school.id)
        .pipe(
          map(resources => resources.getResourcesByPerformance(exam.level))
        );
  }
}
