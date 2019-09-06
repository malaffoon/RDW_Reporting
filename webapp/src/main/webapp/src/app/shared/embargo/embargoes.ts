import { AssessmentType } from '../model/assessment-type';
import { Embargo } from './embargo';

/**
 * Creates an embargo filter used for filtering assessment data from being exported from the system
 *
 * @param embargo The current embargo settings
 * @param getAssessmentType Assessment type accessor
 * @param getAssessmentSchoolYear Assessment school year accessor
 */
export function createFilter<T>(
  embargo: Embargo,
  getAssessmentType: (value: T) => AssessmentType,
  getAssessmentSchoolYear: (value: T) => number
): (value: T) => boolean {
  return (value: T) =>
    !(
      embargo.enabled &&
      'sum' === getAssessmentType(value) &&
      embargo.schoolYear === getAssessmentSchoolYear(value)
    );
}
