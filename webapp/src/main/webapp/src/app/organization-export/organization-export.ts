import { Organization } from './organization/organization';

/**
 * Represents an organization export form
 */
export interface OrganizationExport {
  name?: string;
  schoolYear: number;
  disableTransferAccess: boolean;
  schools: Organization[];
}
