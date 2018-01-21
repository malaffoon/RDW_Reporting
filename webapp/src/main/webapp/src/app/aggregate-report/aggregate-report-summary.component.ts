import { Component, Input } from "@angular/core";
import { AggregateReportFormOptions } from "./aggregate-report-form-options";
import { AggregateReportFormSettings } from "./aggregate-report-form-settings";

@Component({
  selector: 'aggregate-report-summary',
  templateUrl: './aggregate-report-summary.component.html',
})
export class AggregateReportSummary {

  @Input()
  options: AggregateReportFormOptions;

  @Input()
  settings: AggregateReportFormSettings;

  @Input()
  scrollElements: any[];

}
