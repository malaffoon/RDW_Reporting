/**
 * Represents the filter options for an organization export request
 */
export interface OrganizationExportOptions extends GroupedOrganizationIds {
  /**
   * School year to filter on
   */
  readonly schoolYear: number;
}

/**
 * Organization IDs grouped by type
 */
export interface GroupedOrganizationIds {
  /**
   * District IDs to filter on
   */
  readonly districtIds?: number[];

  /**
   * School group IDs to filter on
   */
  readonly schoolGroupIds?: number[];

  /**
   * School IDs to filter on
   */
  readonly schoolIds?: number[];
}
