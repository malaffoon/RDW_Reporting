import { UserOrganizations } from './user-organization';
import {
  createDistrict,
  createSchool,
  createSchoolGroup
} from './organizations';

// TODO extract?
function index<K, V>(array: V[], indexer: (value: V) => K): Map<K, V> {
  return new Map<K, V>(array.map(x => <any>[indexer(x), x]));
}

/**
 * Creates local UserOrganizations model from the provided remote school, school group and district API models
 *
 * @param {any[]} remoteSchools
 * @param {any[]} remoteSchoolGroups
 * @param {any[]} remoteDistricts
 */
export function createUserOrganizations(
  remoteSchools: any[],
  remoteSchoolGroups: any[],
  remoteDistricts: any[]
): UserOrganizations {
  const schools = remoteSchools.map(createSchool),
    schoolGroups = remoteSchoolGroups.map(createSchoolGroup),
    districts = remoteDistricts.map(createDistrict);

  return {
    organizations: [...districts, ...schoolGroups, ...schools],
    schools: schools,
    schoolsById: index(schools, x => x.id),
    schoolGroups: schoolGroups,
    schoolGroupsById: index(schoolGroups, x => x.id),
    districts: districts,
    districtsById: index(districts, x => x.id)
  };
}
