import { FactoryProvider } from '@angular/core/src/di/provider';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { InjectionToken } from '@angular/core';

const AssessmentTypeCodes = ['ica', 'iab', 'sum'];

export const AssessmentTypeField = new InjectionToken('AssessmentTypeField');

export const AssessmentTypeFieldProvider: FactoryProvider = {
  provide: AssessmentTypeField,
  deps: [TranslateService],
  useFactory: (translateService: TranslateService) =>
    of({
      name: 'assessmentType',
      type: 'select',
      label: translateService.instant('report-download.form.assessment-type'),
      options: [undefined, ...AssessmentTypeCodes].map(value => ({
        value,
        text: translateService.instant(
          value != null
            ? `common.assessment-type.${value}.short-name`
            : 'common.collection-selection.all'
        )
      }))
    })
};
