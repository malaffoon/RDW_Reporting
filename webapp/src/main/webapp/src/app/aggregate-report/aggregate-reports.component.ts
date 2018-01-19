import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AggregateReportFormOptions } from "./aggregate-report-form-options";
import { AggregateReportForm } from "./aggregate-report-form";
import { AggregateReportFormSettings } from "./aggregate-report-form-settings";
import { CodedEntity } from "./aggregate-report-options";
import { AssessmentType } from "../shared/enum/assessment-type.enum";

@Component({
  selector: 'aggregate-reports',
  templateUrl: './aggregate-reports.component.html',
})
export class AggregateReportsComponent {

  form: AggregateReportForm;

  constructor(private router: Router,
              private route: ActivatedRoute) {
    this.form = route.snapshot.data[ 'form' ];
  }

  get options(): AggregateReportFormOptions {
    return this.form.options;
  }

  get settings(): AggregateReportFormSettings {
    return this.form.settings;
  }

  get interimFieldsDisabled(): boolean {
    return this.settings.assessmentType.code === 'sum';
  }

  get summativeFieldsDisabled(): boolean {
    return !this.interimFieldsDisabled;
  }

  /**
   * TODO change performance-comparison to accept coded entity or code
   *
   * @param {CodedEntity} assessmentType
   * @returns {AssessmentType}
   */
  toAssessmentTypeEnum(assessmentType: CodedEntity): AssessmentType {
    return [AssessmentType.ICA, AssessmentType.IAB, AssessmentType.SUMMATIVE][assessmentType.id - 1];
  }

  submit(): void {
    this.router.navigate([ 'results' ], {
      queryParams: this.toQueryParameters(this.settings),
      relativeTo: this.route
    })
  }

  /**
   * TODO
   *
   * @param {AggregateReportRequest} request
   * @returns {{assessmentType: number; subjects: any}}
   */
  private toQueryParameters(settings: AggregateReportFormSettings) {
    // TODO finish/optimize
    const idsOf = (a) => a.map(x => x.id);
    return {
      assessmentType: settings.assessmentType.id,
      subjects: idsOf(settings.subjects) // TODO optimize to not include if default?
    }
  }

}
