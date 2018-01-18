import { Component } from "@angular/core";
import { AggregateReportOptions } from "./aggregate-report-options";
import { ActivatedRoute, Router } from "@angular/router";
import { AggregateReportFormOptions } from "./aggregate-report-form-options";
import { Option } from "../shared/sb-toggle.component";
import { AggregateReportFormOptionsMapper } from "./aggregate-report-form-options.mapper";
import { AggregateReportRequest } from "./aggregate-report-request";

@Component({
  selector: 'aggregate-reports',
  templateUrl: './aggregate-reports.component.html',
})
export class AggregateReportsComponent {

  options: AggregateReportFormOptions;

  request: AggregateReportRequest = new AggregateReportRequest();

  constructor(private router: Router,
              private route: ActivatedRoute,
              private optionsMapper: AggregateReportFormOptionsMapper) {

    this.options = optionsMapper.map(route.snapshot.data[ 'options' ]);
    this.request = this.initializeRequest(this.options);
  }

  private initializeRequest(options: AggregateReportFormOptions): AggregateReportRequest {
    const valuesOf = options => options.map(option => option.value);
    const firstValueOf = options => options[0].value;
    const request: AggregateReportRequest = new AggregateReportRequest();
    request.assessmentGrades = valuesOf(options.assessmentGrades);
    request.assessmentType = firstValueOf(options.assessmentTypes);
    request.completenesses = valuesOf(options.completenesses);
    request.interimAdministrationConditions = valuesOf(options.interimAdministrationConditions);
    request.schoolYears = [ firstValueOf(options.schoolYears) ];
    request.subjects = valuesOf(options.subjects);
    request.summativeAdministrationConditions = valuesOf(options.summativeAdministrationConditions);
    return request;
  }

  onChange(event: any): void {
    // console.log('change', event, this.request);
  }

}
