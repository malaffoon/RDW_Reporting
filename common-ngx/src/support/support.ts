export class Utils {

  static getPropertyValue(propertyPath: string, object: any): any {
    let parts = propertyPath.split('.'),
      property = object || this;

    for (let i = 0; i < parts.length; i++) {
      property = property[ parts[ i ] ];
    }
    return property;
  }

  static newGuidReplacer(c: string): string {
    let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  };

  static newGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace('/[xy]/g', Utils.newGuidReplacer);
  }

  static polarEnumToBoolean(value: any): boolean {
    return value === 1;
  }

  static booleanToPolarEnum(value: any): string {
    if (value === true) {
      return '1';
    }
    if (value === false) {
      return '2';
    }
    return undefined;
  }

  static isNullOrEmpty(value: string): boolean {
    return value === null || value.length === 0;
  }

}
