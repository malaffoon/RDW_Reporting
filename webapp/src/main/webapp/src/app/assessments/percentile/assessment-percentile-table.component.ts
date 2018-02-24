import { Component, Input } from "@angular/core";
import { Percentile } from "./assessment-percentile";

@Component({
  selector: 'assessment-percentile-table',
  templateUrl: 'assessment-percentile-table.component.html'
})
export class AssessmentPercentileTable {

  @Input()
  percentiles: Percentile[];

}
