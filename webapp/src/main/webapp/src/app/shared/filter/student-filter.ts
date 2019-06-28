import { isNullOrEmpty, Utils } from '../support/support';
import { Student } from '../../student/search/student';

export interface StudentFilter {
  economicDisadvantages?: string[];
  englishLanguageAcquisitionStatuses?: string[];
  ethnicities?: string[];
  genders?: string[];
  individualEducationPlans?: string[];
  languages?: string[];
  limitedEnglishProficiencies?: string[];
  militaryConnectedCodes?: string[];
  migrantStatuses?: string[];
  section504s?: string[];
}

export type ArrayFilter<T> = (
  student: T,
  index: number,
  students: T[]
) => boolean;
export type StudentArrayFilter = ArrayFilter<Student>;

function includes<T>(filterValues: T[], value: T): boolean {
  return isNullOrEmpty(filterValues) || filterValues.includes(value);
}

function includesAny<T>(filterValues: T[], values: T[]): boolean {
  return (
    isNullOrEmpty(filterValues) ||
    values.some(ethnicity => filterValues.includes(ethnicity))
  );
}

function filterStudent(student: Student, filter: StudentFilter): boolean {
  return (
    includes(filter.genders, student.gender) &&
    includesAny(filter.ethnicities, student.ethnicities) &&
    includes(
      filter.englishLanguageAcquisitionStatuses,
      student.englishLanguageAcquisitionStatus
    ) &&
    includes(
      filter.individualEducationPlans,
      student.individualEducationPlan
    ) &&
    includes(
      filter.limitedEnglishProficiencies,
      student.limitedEnglishProficiency
    ) &&
    includes(filter.economicDisadvantages, student.economicDisadvantage) &&
    includes(filter.section504s, student.section504) &&
    includes(filter.migrantStatuses, student.migrantStatus) &&
    includes(filter.languages, student.languages) &&
    includes(filter.militaryConnectedCodes, student.militaryConnectedCodes)
  );
}

export function createStudentArrayFilter(
  filter: StudentFilter
): StudentArrayFilter {
  return student => filterStudent(student, filter);
}

export function countFilters(filter: StudentFilter): number {
  return Object.entries(filter).reduce((count, [, value]) => {
    return count + (value != null ? value.length : 0);
  }, 0);
}
