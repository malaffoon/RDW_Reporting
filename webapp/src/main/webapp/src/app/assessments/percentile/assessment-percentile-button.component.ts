import { Component, Input } from "@angular/core";
import { AssessmentPercentileRequest, AssessmentPercentileService } from "./assessment-percentile.service";
import { refCount } from "rxjs/operators";
import { Percentile } from "./assessment-percentile";

@Component({
  selector: 'assessment-percentile-button,[assessment-percentile-button]',
  templateUrl: 'assessment-percentile-button.component.html'
})
export class AssessmentPercentileButton {

  @Input()
  request: AssessmentPercentileRequest;

  percentiles: Percentile[];

  constructor(private percentileService: AssessmentPercentileService) {
  }

  onClick(): void {
    this.percentileService.getPercentiles(this.request)
      .pipe(refCount())
  }

}
