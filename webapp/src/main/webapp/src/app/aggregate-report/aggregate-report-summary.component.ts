import { Component, Input } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { SchoolYearPipe } from "../shared/format/school-year.pipe";
import { AggregateReportOptions } from "./aggregate-report-options";
import { AggregateReportFormSettings } from "./aggregate-report-form-settings";
import { AssessmentDefinition } from "./assessment/assessment-definition";


@Component({
  selector: 'aggregate-report-summary',
  templateUrl: 'aggregate-report-summary.component.html',
  host: {
    'class': 'aggregate-report-summary'
  }
})
export class AggregateReportSummary {

  columns: Row[][];

  private _narrow: boolean = false;
  private _options: AggregateReportOptions;
  private _settings: AggregateReportFormSettings;
  private _assessmentDefinition: AssessmentDefinition;

  constructor(private translate: TranslateService,
              private schoolYearPipe: SchoolYearPipe) {
  }

  get narrow(): boolean {
    return this._narrow;
  }

  @Input()
  set narrow(value: boolean) {
    if (this._narrow !== value) {
      this._narrow = value;
      this.updateColumns();
    }
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

  get settings(): AggregateReportFormSettings {
    return this._settings;
  }

  @Input()
  set settings(value: AggregateReportFormSettings) {
    if (this._settings !== value) {
      this._settings = value;
      this.updateColumns();
    }
  }

  get assessmentDefinition(): AssessmentDefinition {
    return this._assessmentDefinition;
  }

  @Input()
  set assessmentDefinition(value: AssessmentDefinition) {
    if (this._assessmentDefinition !== value) {
      this._assessmentDefinition = value;
      this.updateColumns();
    }
  }

  updateColumns(): void {

    const options = this.options;
    const settings = this.settings;
    const assessmentDefinition = this.assessmentDefinition;

    if (options == null
    || settings == null
    || assessmentDefinition == null) {
      return;
    }

    const equalSize = (a, b) => a.length === b.length;
    const translate = code => this.translate.instant(code);

    const All = translate('common.collection-selection.all');
    const None = translate('common.collection-selection.none');

    const orAll = (options, values, codeProvider) => values.length > 0
      ? (equalSize(options, values) ? [ All ] : values.map(codeProvider))
      : [ None ];

    const organizations = settings.districts.concat(settings.schools);

    const includes = [];
    !assessmentDefinition.interim && settings.includeStateResults
      && includes.push(translate('aggregate-reports-summary.field.include.state-results'));
    settings.includeAllDistricts
      && includes.push(translate('aggregate-reports-summary.field.include.all-districts'));
    settings.includeAllSchoolsOfSelectedDistricts
      && includes.push(translate('aggregate-reports-summary.field.include.all-schools-of-districts'));
    settings.includeAllDistrictsOfSelectedSchools
      && includes.push(translate('aggregate-reports-summary.field.include.all-districts-of-schools'));

    const organizationRows = [
      {
        label: translate('aggregate-reports.form.section.organization.heading'),
        values: [
          organizations.length === 0
            ? None
            : organizations.length === 1
            ? organizations[0].name
            : organizations.length
        ]
      },
      {
        label: translate('aggregate-reports.form.section.organization.include.heading'),
        values: includes
      }
    ];

    const assessmentRows = [
      {
        label: translate('aggregate-reports.form.field.assessment-type.label'),
        values: [ translate(`common.assessment-type.${settings.assessmentType}.short-name`) ]
      },
      {
        label: translate('aggregate-reports.form.field.subjects.label'),
        values: orAll(options.subjects, settings.subjects, code => translate(`common.subject.${code}.short-name`))
      },
      {
        label: translate('aggregate-reports.form.field.assessment-grades.label'),
        values: orAll(options.assessmentGrades, settings.assessmentGrades, code => translate(`common.grade.${code}.form-name`))
      },
      {
        label: translate('aggregate-reports.form.field.school-year.label'),
        values: settings.schoolYears.map(value => this.schoolYearPipe.transform(value))
      },
      ...[
        assessmentDefinition.interim
          ? {
            label: translate('aggregate-reports.form.field.interim-administration-condition.label'),
            values: settings.interimAdministrationConditions.map(code => translate(`common.administration-condition.${code}`))
          }
          : {
            label: translate('aggregate-reports.form.field.summative-administration-condition.label'),
            values: settings.summativeAdministrationConditions.map(code => translate(`common.administration-condition.${code}`))
          }
      ],
      {
        label: translate('aggregate-reports.form.field.completeness.label'),
        values: settings.completenesses.map(code => translate(`common.completeness.${code}`))
      }
    ];

    const filterRows = [
      {
        label: translate('aggregate-reports.form.field.gender.label'),
        values: orAll(options.genders, settings.genders, code => translate(`common.gender.${code}`))
      },
      {
        label: translate('aggregate-reports.form.field.ethnicity.label'),
        values: orAll(options.ethnicities, settings.ethnicities, code => translate(`common.ethnicity.${code}`))
      },
      {
        label: translate('aggregate-reports.form.field.migrant-status.label'),
        values: orAll(options.migrantStatuses, settings.migrantStatuses, code => translate(`common.boolean.${code}`))
      },
      {
        label: translate('aggregate-reports.form.field.iep.label'),
        values: orAll(options.individualEducationPlans, settings.individualEducationPlans, code => translate(`common.strict-boolean.${code}`))
      },
      {
        label: translate('aggregate-reports.form.field.504.label'),
        values: orAll(options.section504s, settings.section504s, code => translate(`common.boolean.${code}`))
      }
    ];

    const subgroupRows = [
      {
        label: translate('aggregate-reports.form.field.comparative-subgroup.label'),
        values: orAll(options.dimensionTypes, settings.dimensionTypes, code => translate(`common.dimension.${code}`))
      }
    ];

    this.columns = this.narrow
      ? [[...organizationRows, ...assessmentRows], [...filterRows, ...subgroupRows]]
      : [organizationRows, assessmentRows, filterRows, subgroupRows];
  }

}

interface Row {
  readonly label: string;
  readonly values: string[];
}

