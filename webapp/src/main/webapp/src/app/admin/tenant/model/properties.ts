import { ConfigurationProperty, Property } from './property';
import { field } from './fields';
import { TranslateService } from '@ngx-translate/core';

export function toProperty(key: string, originalValue: any): Property {
  return {
    key,
    originalValue
  };
}

export function toConfigurationProperty(
  key: string,
  originalValue: any,
  translationService: TranslateService
): ConfigurationProperty {
  return {
    ...toProperty(key, originalValue),
    ...field(key, translationService)
  };
}
