export enum ValueDisplayType {
  Percent = 'Percent',
  Number = 'Number'
}

/**
 * Holds methods for dealing with value display types
 */
export abstract class ValueDisplayTypes {

  static values(): ValueDisplayType[] {
    return [ ValueDisplayType.Percent, ValueDisplayType.Number ];
  }

  static valueOf(input: string): ValueDisplayType {
    const value = ValueDisplayType[ input ];
    if (value) {
      return value;
    }
    throw new Error('invalid value display type: ' + input);
  }

}
