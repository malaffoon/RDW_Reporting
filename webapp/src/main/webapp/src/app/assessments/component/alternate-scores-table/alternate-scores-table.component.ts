import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { SubjectDefinition } from '../../../subject/subject';
import { isNullOrEmpty } from '../../../shared/support/support';

// TODO remove in favor of subjectDefinition field
const Scores = [1, 2, 3];
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
  scoreNumber?: number;

  constructor({ id, field = '', sortField = '', scoreNumber = undefined }) {
    this.id = id;
    this.field = field ? field : id;
    this.sortField = sortField ? sortField : this.field;
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

  @Input()
  set subjectDefinition(value: SubjectDefinition) {
    this._subjectDefinition = value;
    this.initialize();
  }

  private initialize(): void {
    // has all the values
    if (this._subjectDefinition != null) {
      this.columns = this.createColumns();
      this.rows = this.createRows();
    }
  }

  private createColumns(): Column[] {
    return [
      new Column({ id: 'performanceLevel' }),
      ...Scores.map(
        (score, index) =>
          new Column({
            id: `aggregateScore${score}`,
            sortField: `aggregateScore${score}.value`,
            scoreNumber: index + 1
          })
      )
    ];
  }

  private createRows(): Row[] {
    const { performanceLevels } = this._subjectDefinition;
    const levels = isNullOrEmpty(performanceLevels)
      ? PerformanceLevels
      : performanceLevels;

    return levels.map((performanceLevel, performanceLevelIndex) => ({
      performanceLevel,
      ...Scores.reduce((scores, score, scoreIndex) => {
        scores[`aggregateScore${score}`] = {
          value: 2,
          percent: 100 - (scoreIndex + 1) * performanceLevelIndex * 4
        };
        return scores;
      }, {})
    }));
  }
}
