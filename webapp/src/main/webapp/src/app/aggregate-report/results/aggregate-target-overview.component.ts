import { Component, Input } from "@angular/core";
import { AggregateTargetOverview } from './aggregate-target-overview';

@Component({
  selector: 'aggregate-target-overview',
  templateUrl: 'aggregate-target-overview.component.html'
})
export class AggregateTargetOverviewComponent {

  @Input()
  overview: AggregateTargetOverview;

}
