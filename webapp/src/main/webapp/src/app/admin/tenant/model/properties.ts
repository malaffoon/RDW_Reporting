import { ConfigurationProperty, Property } from './property';
import { field } from './fields';
import { TranslateService } from '@ngx-translate/core';

// TODO have metadata mappings for each prop
const lowercaseFields = ['urlParts.database', 'username'];

export function toProperty(key: string, defaultValue: any): Property {
  return {
    key,
    defaultValue
  };
}

export function toConfigurationProperty(
  key: string,
  defaultValue: any,
  translationService: TranslateService
): ConfigurationProperty {
  return {
    ...toProperty(key, defaultValue),
    ...field(key, translationService)
  };
}

// TODO call on metadata when returning to server model
export function lowercase(values: {
  [key: string]: any;
}): { [key: string]: any } {
  return Object.entries(values).reduce((lowercased, [key, value]) => {
    lowercased[key] =
      lowercaseFields.some(matcher => key.includes(matcher)) &&
      value != null &&
      typeof value === 'string'
        ? value.toLowerCase()
        : value;
    return lowercased;
  }, {});
}
