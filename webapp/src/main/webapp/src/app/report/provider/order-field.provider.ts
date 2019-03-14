import { FactoryProvider } from '@angular/core/src/di/provider';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { Validators } from '@angular/forms';
import { InjectionToken } from '@angular/core';

const Orders = ['StudentName', 'StudentSSID'];

export const OrderField = new InjectionToken('OrderField');

export const OrderFieldProvider: FactoryProvider = {
  provide: OrderField,
  deps: [TranslateService],
  useFactory: (translateService: TranslateService) =>
    of({
      name: 'order',
      type: 'select',
      validators: [Validators.required],
      label: translateService.instant('report-download.form.order'),
      options: Orders.map(value => ({
        value,
        text: translateService.instant(`report-download.orders.${value}`)
      })),
      defaultValue: Orders[0]
    })
};
