export type PerformanceLevelDisplayType = 'Separate' | 'Grouped';

export abstract class PerformanceLevelDisplayTypes {
  static get Separate(): PerformanceLevelDisplayType {
    return 'Separate';
  }

  static get Grouped(): PerformanceLevelDisplayType {
    return 'Grouped';
  }

  static values(): string[] {
    return ['Separate', 'Grouped'];
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
