import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

// TODO move
// export interface AggregatedScore {
//   code: string;
//   level: number;
//   total: number;
//   count: number;
//   percent: number;
// }

@Component({
  selector: 'aggregate-score-graph',
  templateUrl: './aggregate-score-graph.component.html',
  styleUrls: ['./aggregate-score-graph.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AggregateScoreGraphComponent {
  @Input()
  percent: number;

  @Input()
  count: number;

  @Input()
  color: string;

  @Input()
  displayCount: boolean;
}
