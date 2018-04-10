import { byNumber } from '@kourge/ordering/comparator';

/**
 * @param {number} endYear The year to start the list with
 * @param {string[]} gradeCodes The consecutive grade codes covered by the report
 * @returns {number[]} an array of years starting with the end year followed by consecutive years in the past
 */
export function computeEffectiveYears(endYear: number, gradeCodes: string[]): number[] {
  // This is not foolproof and assumes each grade code can be parsed into a numeric value
  const grades = gradeCodes.map(code => Number.parseInt(code)).sort(byNumber);
  const totalYears = grades[grades.length - 1] - grades[0];
  const years = [ endYear ];
  for (let i = 0; i < totalYears; i++) {
    years.push(endYear - (i + 1));
  }
  return years;
}
