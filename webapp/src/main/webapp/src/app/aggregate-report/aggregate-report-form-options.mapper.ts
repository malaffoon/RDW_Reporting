import { AggregateReportOptions } from "./aggregate-report-options";
import { AggregateReportFormOptions } from "./aggregate-report-form-options";
import { Injectable } from "@angular/core";
import { Option as SbToggleOption } from "../shared/sb-toggle.component";
import { Option as SbCheckboxGroupOption } from "../shared/form/sb-checkbox-group.component";
import { TranslateService } from "@ngx-translate/core";
import { SchoolYearPipe } from "../shared/format/school-year.pipe";

const localeCompare = property => (a, b) => a[ property ].localeCompare(b[ property ]);
const localeCompareText: (a: any, b: any) => number = (a, b) => a.text.localeCompare(b.text);

@Injectable()
export class AggregateReportFormOptionsMapper {

  constructor(private translate: TranslateService,
              private schoolYearPipe: SchoolYearPipe) {
  }

  map(options: AggregateReportOptions): AggregateReportFormOptions {

    return <AggregateReportFormOptions>{
      assessmentGrades: options.assessmentGrades
        .map(entity => <SbCheckboxGroupOption>{
          value: entity,
          text: this.translate.instant(`common.grade.${entity.code}.form-name`),
          analyticsProperties: { label: `Assessment Grade: ${entity.code}` }
        })
        .sort((a, b) => a.value.id - b.value.id),
      assessmentTypes: options.assessmentTypes
        .map(entity => <SbToggleOption>{
          value: entity,
          text: this.translate.instant(`common.assessment-type.${entity.code}.short-name`)
        })
        .sort(localeCompareText),
      completenesses: options.completenesses
        .map(entity => <SbCheckboxGroupOption>{
          value: entity,
          text: this.translate.instant(`common.completeness.${entity.code}`),
          analyticsProperties: { label: `Completeness: ${entity.code}` }
        }),
      interimAdministrationConditions: options.interimAdministrationConditions
        .map(entity => <SbCheckboxGroupOption>{
          value: entity,
          text: this.translate.instant(`common.administration-condition.${entity.code}`),
          analyticsProperties: { label: `Manner of Administration: ${entity.code}` }
        }),
      schoolYears: options.schoolYears
        .map(year => <SbCheckboxGroupOption>{
          value: year,
          text: this.schoolYearPipe.transform(year),
          analyticsProperties: { label: `Assessment Grade: ${year}` }
        })
        .sort((a, b) => b.value - a.value),
      subjects: options.subjects
        .map(entity => <SbCheckboxGroupOption>{
          value: entity,
          text: this.translate.instant(`common.subject.${entity.code}.short-name`),
          analyticsProperties: { label: `Subject: ${entity.code}` }
        })
        .sort((a, b) => a.text.localeCompare(b.text)),
      summativeAdministrationConditions: options.summativeAdministrationConditions
        .map(entity => <SbCheckboxGroupOption>{
          value: entity,
          text: this.translate.instant(`common.administration-condition.${entity.code}`),
          analyticsProperties: { label: `Validity: ${entity.code}` }
        }),
    };

    // return this.dataService.get(`${ServiceRoute}/reportOptions`)
    //   .map(options => <AggregateReportOptions>{
    //     ethnicities: options.ethnicities
    //       .map(mapper(code => `labels.enum.ethnicity.${code}`))
    //       .sort(localeCompareText),
    //     genders: options.genders
    //       .map(mapper(code => `labels.enum.gender.${code}`))
    //       .sort(localeCompareText),
    //     schoolYears: options.schoolYears
    //       .sort((a, b) => a - b),
    //   });

  }


}
