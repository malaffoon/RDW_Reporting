import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AggregateTargetOverview } from './aggregate-target-overview';

@Component({
  selector: 'aggregate-target-overview',
  templateUrl: 'aggregate-target-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AggregateTargetOverviewComponent {
  @Input()
  overview: AggregateTargetOverview;
}
