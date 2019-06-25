import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ScoreTable } from '../score-table/score-table';
import { scoresReported } from '../../model/score-statistics';

@Component({
  selector: 'claim-score-summary',
  templateUrl: './claim-score-summary.component.html',
  styleUrls: ['./claim-score-summary.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClaimScoreSummaryComponent {
  readonly scoresReported = scoresReported;

  @Input()
  table: ScoreTable;

  @Input()
  displayCount: boolean;
}
