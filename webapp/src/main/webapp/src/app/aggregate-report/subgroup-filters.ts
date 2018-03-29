import {Utils} from "../shared/support/support";
import {SubgroupFilterOptions} from "./subgroup-filter-options";
import * as _ from 'lodash';

export interface SubgroupFilters {

  /**
   * Economic disadvantage result filter
   */
  economicDisadvantages: string[];

  /**
   * Race / Ethnicity result filter
   */
  ethnicities: string[];

  /**
   * Gender result filter
   */
  genders: string[];

  /**
   * Individual education plans result filter
   */
  individualEducationPlans: string[];

  /**
   * English learners result filter
   */
  limitedEnglishProficiencies: string[];

  /**
   * Migrant status result filter
   */
  migrantStatuses: string[];

  /**
   * Plan 504 result filter
   */
  section504s: string[];

}

/**
 * @param {SubgroupFilters} a the settings
 * @param {SubgroupFilterOptions} b the default options
 * @returns {boolean} True if the provided filters are equal to the default options
 */
export function isEqualToDefaults(a: SubgroupFilters, b: SubgroupFilterOptions): boolean {
  const equalLength = Utils.hasEqualLength;
  return equalLength(a.genders, b.genders)
    && equalLength(a.ethnicities, b.ethnicities)
    && equalLength(a.migrantStatuses, b.migrantStatuses)
    && equalLength(a.individualEducationPlans, b.individualEducationPlans)
    && equalLength(a.section504s, b.section504s)
    && equalLength(a.limitedEnglishProficiencies, b.limitedEnglishProficiencies)
    && equalLength(a.economicDisadvantages, b.economicDisadvantages);
}

/**
 * @param {SubgroupFilters} a
 * @param {SubgroupFilters} b
 * @returns {boolean} True if the provided filters are equal
 */
export function equals(a: SubgroupFilters, b: SubgroupFilters): boolean {
  const equal = _.isEqual;
  return equal(a.genders, b.genders)
    && equal(a.ethnicities, b.ethnicities)
    && equal(a.migrantStatuses, b.migrantStatuses)
    && equal(a.individualEducationPlans, b.individualEducationPlans)
    && equal(a.section504s, b.section504s)
    && equal(a.limitedEnglishProficiencies, b.limitedEnglishProficiencies)
    && equal(a.economicDisadvantages, b.economicDisadvantages);
}

