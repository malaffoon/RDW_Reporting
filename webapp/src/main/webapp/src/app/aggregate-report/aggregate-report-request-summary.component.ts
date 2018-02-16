import { Component, Input } from "@angular/core";
import { AggregateReportQuery, AggregateReportRequest } from "../report/aggregate-report-request";
import { TranslateService } from "@ngx-translate/core";
import { SchoolYearPipe } from "../shared/format/school-year.pipe";
import { AggregateReportOptions } from "./aggregate-report-options";


@Component({
  selector: 'aggregate-report-request-summary',
  templateUrl: 'aggregate-report-request-summary.component.html',
  host: {
    'class': 'aggregate-report-request-summary'
  }
})
export class AggregateReportRequestSummary {

  columns: Row[][];

  private _options: AggregateReportOptions;
  private _request: AggregateReportRequest;

  constructor(private translate: TranslateService,
              private schoolYearPipe: SchoolYearPipe) {
  }

  get options(): AggregateReportOptions {
    return this._options;
  }

  @Input()
  set options(value: AggregateReportOptions) {
    if (this._options !== value) {
      this._options = value;
      this.updateColumns();
    }
  }

  get request(): AggregateReportRequest {
    return this._request;
  }

  @Input()
  set request(value: AggregateReportRequest) {
    if (this._request !== value) {
      this._request = value;
      this.updateColumns();
    }
  }

  private updateColumns(): void {

    // TODO make this turn request back into settings for ease of use.


    const query: AggregateReportQuery = this.request.reportQuery;
    const options = this.options;
    const hasOption = (options, value) => options.find(option => option.value === value) != null;
    const translate = code => this.translate.instant(code);

    const All = translate('buttons.all');
    const orAll = (values, valueMapper) => values ? values.map(valueMapper) : [ All ];

    const interims: string[] = (query.administrationConditionCodes || [])
      .filter(code => hasOption(options.interimAdministrationConditions, code));

    const interimRows = !interims.length ? [] : [
      {
        label: 'aggregate-reports.form.field.interim-administration-condition.label',
        values: interims.map(code => translate(`common.administration-condition.${code}`))
      }
    ];

    const summatives: string[] = (query.administrationConditionCodes || [])
      .filter(code => hasOption(options.summativeAdministrationConditions, code));

    const summativeRows = !summatives.length ? [] : [
      {
        label: 'aggregate-reports.form.field.summative-administration-condition.label',
        values: summatives.map(code => translate(`common.administration-condition.${code}`))
      }
    ];

    this.columns = [
      [
        {
          label: translate('aggregate-reports.form.field.assessment-type.label'),
          value: translate(`common.assessment-type.${query.assessmentTypeCode}.short-name`)
        },
        {
          label: translate('aggregate-reports.form.field.subjects.label'),
          values: query.subjectCodes.map(code => translate(`common.subject.${code}.short-name`))
        },
        {
          label: translate('aggregate-reports.form.field.assessment-grades.label'),
          values: query.assessmentGradeCodes.map(code => translate(`common.grade.${code}.form-name`))
        },
        {
          label: translate('aggregate-reports.form.field.school-year.label'),
          values: query.schoolYears.map(value => this.schoolYearPipe.transform(value))
        },
        ...interimRows,
        ...summativeRows,
        {
          label: translate('aggregate-reports.form.field.completeness.label'),
          values: query.completenessCodes.map(code => translate(`common.completeness.${code}`))
        }
      ],
      [
        // gender
        // ethnicity
        // migrant
        // iep
        // 504
        // lep
        // econ
        {
          label: translate('aggregate-reports.form.field.gender.label'),
          values: (query.genderCodes || []).map(code => translate(`common.gender.${code}`))
        },
        {
          label: translate('aggregate-reports.form.field.ethnicity.label'),
          values: (query.ethnicityCodes || []).map(code => translate(`common.ethnicity.${code}`))
        },
        {
          label: translate('aggregate-reports.form.field.migrant-status.label'),
          values: (query.migrantStatusCodes || []).map(code => translate(`common.boolean.${code}`))
        },
        {
          label: translate('aggregate-reports.form.field.iep.label'),
          values: (query.iepCodes || []).map(code => translate(`common.strict-boolean.${code}`))
        },
        {
          label: translate('aggregate-reports.form.field.504.label'),
          values: (query.section504Codes || []).map(code => translate(`common.boolean.${code}`))
        }

      ],
      []
    ]
  }

}

interface Row {
  readonly label: string;
  readonly value?: string;
  readonly values?: string[];
}

