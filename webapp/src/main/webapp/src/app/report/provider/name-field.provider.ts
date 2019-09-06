import { FactoryProvider, InjectionToken } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { Validators } from '@angular/forms';

export const NameField = new InjectionToken('NameField');

export const useFactory = (translateService: TranslateService) =>
  of({
    name: 'name',
    type: 'input',
    validators: [Validators.required],
    label: translateService.instant('common.reports.form.report-name')
  });

export const NameFieldProvider: FactoryProvider = {
  provide: NameField,
  deps: [TranslateService],
  useFactory
};
