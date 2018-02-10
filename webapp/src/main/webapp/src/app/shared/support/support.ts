import Timer = NodeJS.Timer;

export class Utils {

  static getPropertyValue(propertyPath: string, object: any): any {
    let parts = propertyPath.split('.'),
      property = object || this;

    for (let i = 0; i < parts.length; i++) {
      property = property[ parts[ i ] ];
    }
    return property;
  }

  static newGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
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

  /**
   * Checks to see if the string or array is <code>null</code>, <code>undefined</code> or empty.
   *
   * @param {string | any[]} value
   * @returns {boolean}
   */
  static isNullOrEmpty(value: string | any[]): boolean {
    return Utils.isNullOrUndefined(value) || value.length === 0;
  }

  static isUndefined(value: any): boolean {
    return typeof value === 'undefined';
  }

  static isNullOrUndefined(value: any): boolean {
    return value == null;
  }

  static setImmediate(callback: (...args: any[]) => void, ...args: any[]): any {
    return setTimeout(callback, 0, ...args);
  }

  static toNgClass(...objectsOrStrings): any {
    const classes = {};
    if (!Utils.isNullOrEmpty(objectsOrStrings)) {
      objectsOrStrings.forEach(objectOrString => {
        Object.assign(classes, Utils.toNgClassObject(objectOrString))
      });
    }
    return classes;
  }

  static toNgClassObject(value: any): any {
    switch (typeof value) {
      case 'string':
        return value.split(/s+/g).reduce((object, key) => {
          object[key] = true;
          return object;
        }, {});
      case 'object':
        return value;
    }
    throw new Error('unsupported ngClass argument');
  }

}
