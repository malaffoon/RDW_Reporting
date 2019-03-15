import { FactoryProvider } from '@angular/core/src/di/provider';
import { TranslateService } from '@ngx-translate/core';
import { SubjectService } from '../../subject/subject.service';
import { map } from 'rxjs/operators';
import { InjectionToken } from '@angular/core';

export const SubjectField = new InjectionToken('SubjectField');

export const useFactory = (
  translateService: TranslateService,
  subjectService: SubjectService
) =>
  subjectService.getSubjectCodes().pipe(
    map(values => ({
      name: 'subject',
      type: 'select',
      label: translateService.instant('common.subject-select-label'),
      options: [undefined, ...values].map(value => ({
        value,
        text: translateService.instant(
          value != null
            ? `subject.${value}.name`
            : 'common.collection-selection.all'
        )
      }))
    }))
  );

export const SubjectFieldProvider: FactoryProvider = {
  provide: SubjectField,
  deps: [TranslateService, SubjectService],
  useFactory
};
