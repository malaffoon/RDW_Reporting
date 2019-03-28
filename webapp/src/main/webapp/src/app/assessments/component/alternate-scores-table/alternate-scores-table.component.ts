import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SubjectDefinition } from '../../../subject/subject';
import { isNullOrEmpty } from '../../../shared/support/support';
import { AssessmentExam } from '../../model/assessment-exam.model';

// TODO remove in favor of subjectDefinition field
const ScoreCodes: string[] = [1, 2, 3, 4, 5, 6].map(value => String(value));
const PerformanceLevels = [1, 2, 3, 4];

// stats.value, this._totalCount
function toDisplayWidthPercent(
  value: number,
  total: number,
  percent: boolean = true
): number {
  return Math.floor(percent ? value : total !== 0 ? (value / total) * 100 : 0);
}

class Column {
  id: string;
  field: string;
  sortField: string;
  scoreCode?: string;
  scoreNumber?: number;

  constructor({
    id,
    field = '',
    sortField = '',
    scoreCode = '',
    scoreNumber = undefined
  }) {
    this.id = id;
    this.field = field ? field : id;
    this.sortField = sortField ? sortField : this.field;
    this.scoreCode = scoreCode;
    this.scoreNumber = scoreNumber;
  }
}

interface Row extends Object {
  performanceLevel: number;
}

@Component({
  selector: 'alternate-scores-table',
  templateUrl: './alternate-scores-table.component.html',
  styleUrls: ['./alternate-scores-table.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlternateScoresTableComponent {
  columns: Column[];
  rows: Row[];
  _subjectDefinition: SubjectDefinition;
  _assessmentExam: AssessmentExam;

  @Input()
  displayCount: boolean;

  @Input()
  set subjectDefinition(value: SubjectDefinition) {
    this._subjectDefinition = value;
    this.initialize();
  }

  @Input()
  set assessmentExam(value: AssessmentExam) {
    this._assessmentExam = value;
    this.initialize();
  }

  private initialize(): void {
    // has all the values
    if (this._subjectDefinition != null && this._assessmentExam != null) {
      this.columns = this.createColumns();
      this.rows = this.createRows();
    }
  }

  private createColumns(): Column[] {
    const { alternateScoreCodes } = this._assessmentExam.assessment;
    // const scoreCodes: string[] = isNullOrEmpty(alternateScoreCodes)
    //   ? ScoreCodes
    //   : alternateScoreCodes;

    const scoreCodes: string[] = alternateScoreCodes;
    return [
      new Column({ id: 'performanceLevel' }),
      ...scoreCodes.map(
        (scoreCode, index) =>
          new Column({
            id: `aggregateScore${scoreCode}`,
            sortField: `aggregateScore${scoreCode}.value`,
            scoreCode,
            scoreNumber: index + 1
          })
      )
    ];
  }

  private createRows(): Row[] {
    const { alternateScoreCodes } = this._assessmentExam.assessment;
    // const scoreCodes: string[] = isNullOrEmpty(alternateScoreCodes)
    //   ? ScoreCodes
    //   : alternateScoreCodes;
    const { performanceLevels } = this._subjectDefinition;
    // const levels: number[] = (isNullOrEmpty(performanceLevels)
    //   ? PerformanceLevels
    //   : performanceLevels).slice().reverse();

    const scoreCodes: string[] = alternateScoreCodes;
    const levels: number[] = performanceLevels.slice().reverse();

    return levels.map((performanceLevel, performanceLevelIndex) => ({
      performanceLevel,
      ...scoreCodes.reduce((scores, score, scoreIndex) => {
        scores[`aggregateScore${score}`] = {
          count: 2,
          percent: 100 - (scoreIndex + performanceLevelIndex) * 10
        };
        return scores;
      }, {})
    }));
  }
}
