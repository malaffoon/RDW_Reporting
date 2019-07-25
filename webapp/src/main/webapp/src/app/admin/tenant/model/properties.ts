import { ConfigurationProperty, Property } from './property';
import { field } from './fields';
import { TranslateService } from '@ngx-translate/core';

export function toProperty(
  key: string,
  originalValue: any,
  writable?: boolean
): Property {
  return {
    key,
    originalValue,
    writable
  };
}

export function toConfigurationProperty(
  key: string,
  originalValue: any,
  writable: boolean,
  translationService: TranslateService
): ConfigurationProperty {
  return {
    ...toProperty(key, originalValue, writable),
    ...field(key, translationService)
  };
}
