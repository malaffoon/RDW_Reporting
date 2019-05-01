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

  @Input()
  table: ScoreTable;
}
