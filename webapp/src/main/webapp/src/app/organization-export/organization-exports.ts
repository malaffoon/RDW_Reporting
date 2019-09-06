import { Organization } from './organization/organization';
import { OrganizationType } from './organization/organization-type.enum';
import { Option } from '../shared/form/sb-typeahead.component';

/**
 * Creates a composite ID by compounding the organization type and ID
 *
 * @param {OrganizationType} type the organization type
 * @param {number} id the organization entity ID
 * @returns {string} the composite ID
 */
function createCompositeId(type: OrganizationType, id: number): string {
  return `${type}-${id}`;
}

/**
 * Helper which prevents redundancy from occurring in the expanded set of organizations
 */
class Grouping<A, B> {
  private keys: Set<A> = new Set();

  constructor(private values: B[]) {}

  /**
   * Appends the result of the provided factory method to the given array if the key is not present
   *
   * @param {A} key the ID used to check for presence
   * @param {() => B} factory the result of this method will be added to the array
   */
  computeIfAbsent(key: A, factory: () => B): void {
    if (!this.keys.has(key)) {
      this.keys.add(key);
      this.values.push(factory());
    }
  }
}

/**
 * Creates organization options for selection.
 *
 * @param {Organization[]} schools
 * @param {Map<string, Option>} optionsByUuid
 * @returns {Option[]}
 */
export function createOptions(
  schools: Organization[],
  optionsByUuid: Map<string, Option>
): Option[] {
  const options = [],
    districts = new Grouping<string, Option>(options),
    schoolGroups = new Grouping<string, Option>(options);

  schools.forEach(school => {
    const districtUuid = createCompositeId(
        OrganizationType.District,
        school.districtId
      ),
      schoolGroupUuid = createCompositeId(
        OrganizationType.SchoolGroup,
        school.schoolGroupId
      ),
      schoolUuid = school.uuid;

    school.districtId &&
      districts.computeIfAbsent(districtUuid, () =>
        optionsByUuid.get(districtUuid)
      );
    school.schoolGroupId &&
      schoolGroups.computeIfAbsent(schoolGroupUuid, () =>
        optionsByUuid.get(schoolGroupUuid)
      );
    options.push(optionsByUuid.get(schoolUuid));
  });
  return options;
}
