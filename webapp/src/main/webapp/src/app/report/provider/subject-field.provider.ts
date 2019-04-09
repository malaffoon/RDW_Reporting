import { TranslateService } from '@ngx-translate/core';
import { SubjectService } from '../../subject/subject.service';
import { map } from 'rxjs/operators';
import { FactoryProvider, InjectionToken } from '@angular/core';
import { forkJoin } from 'rxjs';

export const SubjectField = new InjectionToken('SubjectField');

export const useFactory = (
  translateService: TranslateService,
  subjectService: SubjectService
) =>
  forkJoin(
    subjectService.getSubjectCodes(),
    subjectService.getSubjectDefinitions()
  ).pipe(
    map(([values, subjectDefinitions]) => ({
      name: 'subject',
      type: 'select',
      label: translateService.instant('common.subject-select-label'),
      options: [
        undefined,
        ...values.filter(
          value =>
            subjectDefinitions.find(({ subject }) => subject === value)
              .printedReportsEnabled
        )
      ].map(value => ({
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
