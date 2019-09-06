import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

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
  backgroundColor: string = 'gray';

  @Input()
  displayCount: boolean;
}
