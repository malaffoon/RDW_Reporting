export class ConfigurationProperty {
  key: string;
  originalValue: string;
  value: string;
  group?: string;

  get formControlName(): string {
    if (this.group) {
      return `${this.group}.${this.key}`;
    }
    return this.key;
  }

  constructor(key, value, group = null, originalVal = value) {
    this.key = key;
    this.value = value;
    this.originalValue = originalVal;
    this.group = group;
  }
}
