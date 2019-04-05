// TODO make enum
const Separate = 'Separate';
const Grouped = 'Grouped';

export abstract class PerformanceLevelDisplayTypes {
  static get Separate(): string {
    return Separate;
  }

  static get Grouped(): string {
    return Grouped;
  }

  static values(): string[] {
    return [Separate, Grouped];
  }

  static valueOf(input: string): string {
    const value = PerformanceLevelDisplayTypes.values().find(
      value => value === input
    );
    if (value) {
      return value;
    }
    throw new Error('Unknown PerformanceLevelDisplayType: ' + input);
  }
}
