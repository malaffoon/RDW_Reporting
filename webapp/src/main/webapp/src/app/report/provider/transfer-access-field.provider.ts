import { FactoryProvider } from '@angular/core/src/di/provider';
import { TranslateService } from '@ngx-translate/core';
import { ApplicationSettingsService } from '../../app-settings.service';
import { map } from 'rxjs/operators';
import { Validators } from '@angular/forms';
import { InjectionToken } from '@angular/core';

export const TransferAccessField = new InjectionToken('TransferAccessField');

export const useFactory = (
  translateService: TranslateService,
  settingsService: ApplicationSettingsService
) =>
  settingsService.getSettings().pipe(
    map(({ transferAccess }) => ({
      name: 'transferAccess',
      type: 'toggle',
      validators: [Validators.required],
      info: {
        title: translateService.instant(
          'common.filters.test.transfer-assessment'
        ),
        content: translateService.instant(
          'common.filters.test.transfer-assessment-info'
        )
      },
      options: [
        {
          value: true,
          text: translateService.instant('common.action.show')
        },
        {
          value: false,
          text: translateService.instant('common.action.hide')
        }
      ],
      defaultValue: false,
      excluded: !transferAccess
    }))
  );

export const TransferAccessFieldProvider: FactoryProvider = {
  provide: TransferAccessField,
  deps: [TranslateService, ApplicationSettingsService],
  useFactory
};
