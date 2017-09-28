import { Organization } from "./organization";

/**
 * Represents a school in the organizational hierarchy and contains all ancestor information
 */
export interface FlatSchool extends Organization {

  /**
   * The school's group name if a group exists
   */
  readonly schoolGroupName?: string;

  /**
   * The school's district name if the district exists
   */
  readonly districtName?: string;

  /**
   * The school's district group name if the group exists
   */
  readonly districtGroupName?: string;

}
