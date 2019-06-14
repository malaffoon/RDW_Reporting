export class ConfigurationProperty {
  key: string;
  originalValue: string;
  value: string;
  group?: string;
  formControlName: string;
  encrypted?: boolean;
  required?: boolean;

  constructor(key, value, group = null, originalVal = value) {
    this.key = key;
    this.value = value;
    this.originalValue = originalVal;
    this.group = group;
    this.formControlName = group ? `${group}.${key}` : key;
  }
}
