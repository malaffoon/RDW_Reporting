export class ConfigurationProperty {
  key: string;
  originalValue: string;
  value: string;
  formControlName?: string;

  constructor(key, value, originalVal = value) {
    this.key = key;
    this.value = value;
    this.originalValue = originalVal;
  }
}
