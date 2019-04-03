import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ScoreTable, ScoreTablePerformanceLevelScores } from './score-table';

@Component({
  selector: 'score-table',
  templateUrl: './score-table.component.html',
  styleUrls: ['./score-table.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScoreTableComponent {
  @Input()
  displayCount: boolean;

  _table: ScoreTable;
  _orderedPerformanceLevelScores: ScoreTablePerformanceLevelScores[];

  @Input()
  set table(value: ScoreTable) {
    this._table = value;
    this._orderedPerformanceLevelScores = value.scoreStatistics[0].performanceLevelScores
      .slice()
      .reverse();
  }
}
