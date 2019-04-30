export class SandboxConfigurationProperty {
  key: string;
  originalValue: string;
  value: string;

  constructor(key, value, originalVal = value) {
    this.key = key;
    this.value = value;
    this.originalValue = originalVal;
  }
}
