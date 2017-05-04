export class Utils {
  static getPropertyValue( propertyName, object ) {
    var parts = propertyName.split("."),
      length = parts.length,
      i,
      property = object || this;

    for (i = 0; i < length; i++) {
      property = property[ parts[ i ] ];
    }

    return property;
  }
}
