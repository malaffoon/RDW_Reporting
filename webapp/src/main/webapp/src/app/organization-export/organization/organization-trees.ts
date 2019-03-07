import { UserOrganizations } from './user-organization';
import { Tree } from './tree';
import { District, Organization, SchoolGroup } from './organization';

function getOrCreateDistrict(
  organizations: UserOrganizations,
  id: number
): District {
  if (organizations.districtsById.has(id)) {
    return organizations.districtsById.get(id);
  }
  const district: District = new District();
  if (id != null) {
    district.id = id;
  }
  return district;
}

function getOrCreateSchoolGroup(
  organizations: UserOrganizations,
  id: number
): SchoolGroup {
  if (organizations.schoolGroupsById.has(id)) {
    return organizations.schoolGroupsById.get(id);
  }
  const schoolGroup: SchoolGroup = new SchoolGroup();
  if (id != null) {
    schoolGroup.id = id;
  }
  return schoolGroup;
}

/**
 * Creates organization hierarchy for the given schools and master set of organizations.
 * This method will add placeholder ancestor nodes to the school when then school group or district ID is undefined.
 *
 * @param {Organization[]} schools the schools to create the hierarchy with
 * @param {UserOrganizations} organizations master set of organizations to draw into the tree when referenced by the school's ancestor IDs
 * @returns {Tree<Organization>}
 */
export function createOrganizationTreeWithPlaceholders(
  schools: Organization[],
  organizations: UserOrganizations
): Tree<Organization> {
  const root = new Tree<Organization>();
  schools.forEach(school =>
    root
      .getOrCreate(
        x => x.id === school.districtId,
        getOrCreateDistrict(organizations, school.districtId)
      )
      .getOrCreate(
        x => x.id === school.schoolGroupId,
        getOrCreateSchoolGroup(organizations, school.schoolGroupId)
      )
      .create(school)
  );
  return root;
}

/**
 * Creates organization hierarchy with the given organizations.
 *
 * @param {UserOrganizations} organizations master set of organizations to create the tree from
 * @returns {Tree<Organization>} organization hierarchy
 */
export function createOrganizationTree(
  organizations: UserOrganizations
): Tree<Organization> {
  const root = new Tree<Organization>();
  organizations.schools.forEach(school => {
    let node = root;
    if (school.districtId != null) {
      node = node.getOrCreate(
        x => x.id === school.districtId,
        getOrCreateDistrict(organizations, school.districtId)
      );
    }
    if (school.schoolGroupId != null) {
      node = node.getOrCreate(
        x => x.id === school.schoolGroupId,
        getOrCreateSchoolGroup(organizations, school.schoolGroupId)
      );
    }
    node.create(school);
  });
  return root;
}
