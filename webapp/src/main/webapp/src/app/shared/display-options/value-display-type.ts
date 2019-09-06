// TODO make enum
const Percent = 'Percent';
const Number = 'Number';

export abstract class ValueDisplayTypes {
  static get Percent(): string {
    return Percent;
  }

  static get Number(): string {
    return Number;
  }

  static values(): string[] {
    return [Percent, Number];
  }

  static valueOf(input: string): string {
    const value = ValueDisplayTypes.values().find(value => value === input);
    if (value) {
      return value;
    }
    throw new Error('Unknown ValueDisplayType: ' + input);
  }
}
