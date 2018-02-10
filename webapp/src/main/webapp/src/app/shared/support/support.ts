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

  /**
   * Calls the provided callback in the next frame
   *
   * @param {(...args: any[]) => void} callback the function to call
   * @param args the callback function's arguments
   * @returns {any} the timeout handle
   */
  static setImmediate(callback: (...args: any[]) => void, ...args: any[]): any {
    return setTimeout(callback, 0, ...args);
  }

  /**
   * Creates one object from many ngClass formatted strings or objects.
   * Expects arguments like: 'some-class another-class' or {'some-class': true, 'another-class': false}
   *
   * @param objectsOrStrings
   * @returns {any}
   */
  static toNgClass(...objectsOrStrings): any {
    const classes = {};
    if (!Utils.isNullOrEmpty(objectsOrStrings)) {
      objectsOrStrings.forEach(objectOrString => {
        Object.assign(classes, Utils.toNgClassObject(objectOrString))
      });
    }
    return classes;
  }

  /**
   * Takes a css class attribute formatted string and turns it into an object.
   * If it is already an object it will return that object.
   *
   * @param value the css class string or ngClass object
   * @returns {any} an ngClass object
   */
  static toNgClassObject(value: any): any {
    switch (typeof value) {
      case 'string':
        return value.split(/s+/g).reduce((object, key) => {
          object[ key ] = true;
          return object;
        }, {});
      case 'object':
        return value;
    }
    throw new Error('unsupported ngClass argument');
  }

}
