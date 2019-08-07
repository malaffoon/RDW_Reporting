import { ConfigurationProperty, Property } from './property';
import { field } from './fields';
import { TranslateService } from '@ngx-translate/core';
import { FieldConfigurationContext } from './field';

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
  context: FieldConfigurationContext
): ConfigurationProperty {
  return {
    ...toProperty(key, originalValue, writable),
    ...field(key, context)
  };
}
