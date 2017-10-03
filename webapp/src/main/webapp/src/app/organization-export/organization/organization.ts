import { OrganizationType } from "./organization-type.enum";

/**
 * Represents an organization in the organizational hierarchy
 */
export interface Organization {

  /**
   * Fully qualified organization ID
   */
  readonly uuid: string;

  /**
   * The organization type (school, district, ...etc)
   */
  readonly type: OrganizationType;

  /**
   * The organization ID
   */
  readonly id: number;

  /**
   * The organization name
   */
  readonly name: string;

  /**
   * The organization school ID
   * This will only be present on schools and is used by the isOrIsAncestorOf() method
   */
  readonly schoolId?: number;

  /**
   * The organization's school group ID
   * This will be present on schools or school groups and is used by the isOrIsAncestorOf() method
   */
  readonly schoolGroupId?: number;

  /**
   * The organization's district ID
   * This will be present on schools, school groups or districts and is used by the isOrIsAncestorOf() method
   */
  readonly districtId?: number;

  /**
   * The organization's createDistrict ID
   * This will be present on schools, school groups, districts or createDistrict groups and is used by the isOrIsAncestorOf() method
   */
  readonly districtGroupId?: number;

  /**
   * Determines if the organization has the same ID or is an ancestor of the given argument.
   *
   * @param x the organization to test
   * @returns <code>true</code> if the organization's ID is the same or it is an ancestor of the given organization
   */
  readonly isOrIsAncestorOf?: (x: Organization) => boolean;

}
