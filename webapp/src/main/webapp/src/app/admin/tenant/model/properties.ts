import { configurationFormFields } from './configuration-forms';
import { stringDataType } from './data-types';
import { TenantType } from './tenant-type';
import { FormMode } from '../component/tenant-form/tenant-form.component';
import { Property } from './property';

export function toConfigurationProperties(
  defaults: any,
  tenantType: TenantType,
  formMode: FormMode
): Property[] {
  return configurationFormFields(tenantType, formMode).map(field => ({
    ...field,
    originalValue: defaults[field.configuration.name]
  }));
}

export function toLocalizationProperties(defaults: any): Property[] {
  return Object.keys(defaults || {}).map(name => ({
    configuration: {
      name,
      dataType: stringDataType
    },
    validators: [],
    originalValue: defaults[name]
  }));
}
