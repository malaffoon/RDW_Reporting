export enum PerformanceLevelDisplayType {
  Separate,
  Grouped
}

/**
 * Holds methods for dealing with performance level display types
 */
export abstract class PerformanceLevelDisplayTypes {

  static values(): PerformanceLevelDisplayType[] {
    return [ PerformanceLevelDisplayType.Separate, PerformanceLevelDisplayType.Grouped ];
  }

  static valueOf(input: string): PerformanceLevelDisplayType {
    const value = PerformanceLevelDisplayType[ input ];
    if (value) {
      return value;
    }
    throw new Error('invalid value display type: ' + input);
  }

}
