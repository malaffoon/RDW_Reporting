import { Organization } from './organization/organization';
import { UserOrganizations } from './organization/user-organization';
import { GroupedOrganizationIds } from './organization-export-options';
import { OrganizationType } from './organization/organization-type.enum';
import { Tree } from './organization/tree';
import { createOrganizationTree } from './organization/organization-trees';
import { OrganizationExport } from './organization-export';
import { DistrictSchoolExportReportQuery } from '../report/report';

/**
 * Converts an organization export and user entitled organizations into an export report query
 *
 * @param organizationExport The export
 * @param userOrganizations The user organizations
 */
export function createOrganizationExportQuery(
  organizationExport: OrganizationExport,
  userOrganizations: UserOrganizations
): DistrictSchoolExportReportQuery {
  return {
    type: 'DistrictSchoolExport',
    name: organizationExport.name,
    schoolYear: organizationExport.schoolYear,
    disableTransferAccess: organizationExport.disableTransferAccess,
    ...groupSelectedOrganizationIdsByType(
      organizationExport.schools,
      userOrganizations
    )
  };
}

/**
 * Groups selected organization IDs by type into a grouped organization ID holder.
 * This is to shrink the payload size to the server by reducing all schools of a group to just a school group ID
 * and further to a district ID when all schools of the group of district are selected.
 *
 * @param {Organization[]} schools the selected schools
 * @param {UserOrganizations} organizations all user organizations
 * @returns {GroupedOrganizationIds} the grouped selected organization IDs
 */
export function groupSelectedOrganizationIdsByType(
  schools: Organization[],
  organizations: UserOrganizations
): GroupedOrganizationIds {
  // creates export request with organization type buckets for use in later processing
  const ids = {
    districtIds: [],
    schoolGroupIds: [],
    schoolIds: []
  };

  // all school IDs selected by the user
  const selectedSchoolIds = new Set<number>(schools.map(school => school.id));

  // organizational hierarchy of all organizations entitled to the user
  const organizationTree = createOrganizationTree(organizations);

  // starts the recursive grouping of organizations by type
  organizationTree.children.forEach(child =>
    groupIfAllDescendantsSelected(child, selectedSchoolIds, ids)
  );

  return ids;
}

/**
 * Adds the given organization's ID to the appropriate ID collection in the given grouped organization ID holder.
 *
 * @param {Organization} organization the organization to add
 * @param {GroupedOrganizationIds} ids the ID collection holder to add the organization ID to
 */
function groupOrganization(
  organization: Organization,
  ids: GroupedOrganizationIds
): void {
  switch (organization.type) {
    case OrganizationType.District:
      ids.districtIds.push(organization.id);
      break;
    case OrganizationType.SchoolGroup:
      ids.schoolGroupIds.push(organization.id);
      break;
    case OrganizationType.School:
      ids.schoolIds.push(organization.id);
      break;
  }
}

/**
 * Recursively checks if all descendants of the given tree node are selected using the given selected school ID collection
 *
 * @param {Tree<Organization>} node the node to check
 * @param {Set<number>} selectedSchoolIds the selected school IDs
 * @returns {boolean} <code>true</code> if all descendants of the given node are selected
 */
function allDescendantsSelected(
  node: Tree<Organization>,
  selectedSchoolIds: Set<number>
): boolean {
  if (node.value.type === OrganizationType.School) {
    return selectedSchoolIds.has(node.value.id);
  }
  return node.children.every(child =>
    allDescendantsSelected(child, selectedSchoolIds)
  );
}

/**
 * Recursively adds organization ID to grouped organization IDs if all of its descendants are selected.
 * If all of the node's descendants are selected it does not continue recursively checking descendants.
 *
 * @param {Tree<Organization>} node the tree node to check descendant selection for
 * @param {Set<number>} selectedSchoolIds master set of all selected school IDs
 * @param {GroupedOrganizationIds} ids grouped organization IDs
 */
function groupIfAllDescendantsSelected(
  node: Tree<Organization>,
  selectedSchoolIds: Set<number>,
  ids: GroupedOrganizationIds
): void {
  if (
    validGroupingNode(node) &&
    allDescendantsSelected(node, selectedSchoolIds)
  ) {
    groupOrganization(node.value, ids);
  } else {
    node.children.forEach(child =>
      groupIfAllDescendantsSelected(child, selectedSchoolIds, ids)
    );
  }
}

/**
 * Test if this is a valid grouping node.  While building the organization tree we create shallow
 * placeholders for districts and school groups that the user does not have explicit access to.  These
 * shallow nodes should not be used for grouping.
 *
 * @param {Tree<Organization>} node An organizaiton node
 * @returns {boolean} True if the node is a valid grouping node
 */
function validGroupingNode(node: Tree<Organization>) {
  return node.value.name != null;
}
