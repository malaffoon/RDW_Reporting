import { FactoryProvider } from '@angular/core/src/di/provider';
import { TranslateService } from '@ngx-translate/core';
import { SchoolYearPipe } from '../../shared/format/school-year.pipe';
import { ExamFilterOptionsService } from '../../assessments/filters/exam-filters/exam-filter-options.service';
import { map } from 'rxjs/operators';
import { Validators } from '@angular/forms';
import { InjectionToken } from '@angular/core';

export const SchoolYearField = new InjectionToken('SchoolYearField');

export const useFactory = (
  translateService: TranslateService,
  schoolYearPipe: SchoolYearPipe,
  optionsService: ExamFilterOptionsService
) =>
  optionsService.getExamFilterOptions().pipe(
    map(({ schoolYears }) => ({
      name: 'schoolYear',
      type: 'select',
      validators: [Validators.required],
      label: translateService.instant('common.school-year-select-label'),
      options: schoolYears.map(value => ({
        value,
        text: <string>schoolYearPipe.transform(value)
      })),
      defaultValue: schoolYears[0]
    }))
  );

export const SchoolYearFieldProvider: FactoryProvider = {
  provide: SchoolYearField,
  deps: [TranslateService, SchoolYearPipe, ExamFilterOptionsService],
  useFactory
};
