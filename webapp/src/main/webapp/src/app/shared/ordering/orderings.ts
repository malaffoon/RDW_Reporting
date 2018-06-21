import { byString, ranking } from '@kourge/ordering/comparator';
import { Ordering, ordering } from '@kourge/ordering';

export const AssessmentTypeOrdering = ordering(ranking(['sum', 'ica', 'iab']));

// TODO:ConfigurableSubjects these should be provided by the backend
/** @deprecated */
export const SubjectOrdering = ordering(ranking(['Math', 'ELA']));

export const BooleanOrdering = ordering(ranking([ 'yes', 'no', 'undefined' ]));

export const CompletenessOrdering = ordering(ranking([ 'Complete', 'Partial' ]));
/** @deprecated */
export const ScorableClaimOrder: Map<string, string[]> = new Map([
  [ 'Math', [ '1', 'SOCK_2', '3' ] ],
  [ 'ELA', [ 'SOCK_R', '2-W', 'SOCK_LS', '4-CR' ] ]
]);
/** @deprecated */
export const ScorableClaimOrderings: Map<string, Ordering<string>> = new Map([
  [ 'Math', ordering(ranking(ScorableClaimOrder.get('Math'))) ],
  [ 'ELA', ordering(ranking(ScorableClaimOrder.get('ELA'))) ]
]);
/** @deprecated */
export const createScorableClaimOrdering: (subjectCode: string) => Ordering<any> = (subjectCode) => {
  return ScorableClaimOrderings.has(subjectCode)
    ? ScorableClaimOrderings.get(subjectCode)
    : ordering(byString);
};

// TODO:ConfigurableSubjects this needs to be provided by the backend
/** @deprecated */
export const SubjectClaimOrder: Map<string, string[]> = new Map([
  ['Math', ['1', '2', '3', '4']],
  ['ELA', ['1-LT', '1-IT', '2-W', '3-L', '3-S', '4-CR']]
]);

// TODO:ConfigurableSubjects this needs to be provided by the backend
/** @deprecated */
export const SubjectClaimOrderings: Map<string, Ordering<string>> = new Map([
  ['Math', ordering(ranking(SubjectClaimOrder.get('Math')))],
  ['ELA', ordering(ranking(SubjectClaimOrder.get('ELA')))]
]);

/**
 * Comparator for ordering two strings which may represent numbers such that
 * "A" < "B" and "2" < "10"
 *
 * @param {string} a  A string value
 * @param {string} b  A string value
 * @returns {number}  0 if equal, less than 0 if a < b, greater than 0 if a > b
 */
export const byNumericString = (a: string, b: string) => {
  const numA = Number(a);
  const numB = Number(b);

  if (!Number.isNaN(numA) && !Number.isNaN(numB)) return numA - numB;

  return a.localeCompare(b);
};


export function createRankingOrStringOrdering<T>(rankings: any[]): Ordering<T> {
  return ordering(rankings != null ? ranking(rankings) : byString);
}
