export class OldConfigProp {
  key: string;
  originalValue: string;
  value: string;
  group?: string;
  formControlName: string;
  encrypted?: boolean;
  secure?: boolean;
  showSecure?: boolean;
  required?: boolean;
  readonly: boolean;
  lowercase: boolean;

  get modified() {
    return this.originalValue !== this.value;
  }

  constructor(key, value, group = null, originalVal = value) {
    this.key = key;
    this.value = value;
    this.originalValue = originalVal;
    this.group = group;
    this.formControlName = group ? `${group}.${key}` : key;
  }
}
