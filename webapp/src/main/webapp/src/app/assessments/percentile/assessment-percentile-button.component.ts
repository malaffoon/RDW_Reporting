import { Component, Input } from "@angular/core";
import { Percentile } from "./assessment-percentile";
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'assessment-percentile-button',
  templateUrl: 'assessment-percentile-button.component.html'
})
export class AssessmentPercentileButton {

  @Input()
  percentileSource: Observable<Percentile[]>;

  @Input()
  placement: string = 'top';

  percentiles: Percentile[];

  ngOnInit(): void {
    if (this.percentileSource == null
      || typeof this.percentileSource !== 'function') {
      throw new Error('AssessmentPercentileButton percentileSource is required');
    }
  }

  onClickInternal(): void {
    this.percentileSource.subscribe(percentiles => this.percentiles = percentiles);
  }

}
