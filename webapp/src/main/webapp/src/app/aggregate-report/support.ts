import { District, Organization, OrganizationType, School } from '../shared/organization/organization';
import { Ordering, ordering } from '@kourge/ordering';
import { byNumber, byString, join, ranking } from '@kourge/ordering/comparator';
import { AggregateReportOptions } from './aggregate-report-options';
import { Subgroup } from './subgroup/subgroup';

const OverallDimensionType: string = 'Overall';

/**
 * @param {number} endYear The year to start the list with
 * @param {string[]} gradeCodes The consecutive grade codes covered by the report
 * @returns {number[]} an array of years starting with the end year followed by the expected years corresponding to the grades
 */
export function computeEffectiveYears(endYear: number, gradeCodes: string[]): number[] {
  // This is not foolproof and assumes each grade code can be parsed into a numeric value
  return gradeCodes
    .map(code => Number.parseInt(code))
    .sort((a, b) => b - a)
    .map((grade, index, grades) => endYear - (grades[ 0 ] - grade));
}

/**
 * @param {(item: T) => Organization} organizationGetter method accepting an element of the elements to sort that returns that element's organization
 * @param {T[]} items all items to be compared. This is needed to successfully order schools grouped by district
 * @returns {Ordering<T>} creates natural organization ordering
 */
export function organizationOrdering<T>(organizationGetter: (item: T) => Organization, items: T[]): Ordering<T> {

  const districtNamesById = items.reduce((districtNamesById, item) => {
    const organization = organizationGetter(item);
    if (organization.type === OrganizationType.District) {
      districtNamesById.set((<District>organization).id, organization.name);
    }
    return districtNamesById;
  }, new Map());

  const stateOrdering = ordering(ranking([ OrganizationType.State ]))
    .reverse()
    .on(item => organizationGetter(item).type);

  const districtsWithSchoolsByName: Ordering = ordering(byString)
    .on(item => {
      switch (organizationGetter(item).type) {
        case OrganizationType.District:
          return districtNamesById.get((organizationGetter(item) as District).id) || '';
        case OrganizationType.School:
          return districtNamesById.get((organizationGetter(item) as School).districtId) || '';
        default:
          return '';
      }
    });

  const districtsWithSchoolsByIdOrdering = ordering(byNumber)
    .on(item => {
      switch (organizationGetter(item).type) {
        case OrganizationType.District:
          return (item.organization as District).id;
        case OrganizationType.School:
          return (item.organization as School).districtId;
        default:
          return -1;
      }
    });

  const districtOrdering = ordering(ranking([ OrganizationType.District ]))
    .reverse()
    .on(item => organizationGetter(item).type);

  const schoolOrdering = ordering(byString)
    .on(item => organizationGetter(item).name);

  return ordering(
    join(
      stateOrdering.compare,
      districtsWithSchoolsByName.compare,
      districtsWithSchoolsByIdOrdering.compare,
      districtOrdering.compare,
      schoolOrdering.compare
    )
  );
}


export function subgroupOrdering<T>(subgroupGetter: (item: T) => Subgroup,options: AggregateReportOptions): Ordering<T> {

  const dimensionOptionsByDimensionType = {
    Gender: options.studentFilters.genders,
    Ethnicity: options.studentFilters.ethnicities,
    LEP: options.studentFilters.limitedEnglishProficiencies,
    ELAS: options.studentFilters.englishLanguageAcquisitionStatuses,
    MigrantStatus: options.studentFilters.migrantStatuses,
    Section504: options.studentFilters.migrantStatuses,
    IEP: options.studentFilters.individualEducationPlans,
    EconomicDisadvantage: options.studentFilters.economicDisadvantages
  };

  const dimensionTypeAndCodeRankingValues = options.dimensionTypes.reduce((ranking, dimensionType) => {
    return ranking.concat(
      (dimensionOptionsByDimensionType[ dimensionType ] || []).map(dimensionCode => `${dimensionType}:${dimensionCode}`)
    );
  }, []);

  const dimensionTypeAndCodeComparator = ordering(ranking(
    [ OverallDimensionType, ...dimensionTypeAndCodeRankingValues ]
  ))
    .on(item => subgroupGetter(item).id)
    .compare;

  // Attempt to sort based upon the enrolled grade code as a number ("01", "02", "KG", "UG", etc)
  // If the code cannot be parsed as a number, the order is undefined
  // TODO we should have a specific ordering for all grade codes, although the system only currently uses "03" - "12"
  const enrolledGradeComparator = ordering(byNumber)
    .on(item => {
      const { type, codes } = subgroupGetter(item);
      if (type == null || type !== 'StudentEnrolledGrade') {
        return -1;
      }
      try {
        return Number.parseInt(codes[ 0 ]);
      } catch (error) {
        return 1;
      }
    })
    .compare;

  return ordering(join(
    dimensionTypeAndCodeComparator,
    enrolledGradeComparator,
    // hotfix Overall order on FilteredSubgroup results
    (a: T, b: T) => {
      if (subgroupGetter(a).id === 'Overall:') {
        return -1;
      }
      if (subgroupGetter(b).id === 'Overall:') {
        return 1;
      }
      return 0;
    },
    ordering(byString).on(({ subgroup }) => subgroup.id).compare
  ));
}
