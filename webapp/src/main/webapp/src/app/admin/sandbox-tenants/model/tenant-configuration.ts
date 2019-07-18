import { ConfigurationProperty } from './configuration-property';
import { TenantStatus } from './tenant-status';
import { TenantType } from './tenant-type';

/**
 * Holds information regarding an RDW tenant configuration
 */
export interface TenantConfiguration {
  /**
   * The unique external id for the tenant
   */
  id?: string;

  /**
   * The unique internal key for the tenant
   */
  code?: string;

  /**
   * A human readable label, name, or description of the tenant
   */
  label?: string;

  /**
   * Optional additional description of the tenant configuration
   */
  description?: string;

  /**
   * The map containing text/i18n overrides
   */
  localizationOverrides?: ConfigurationProperty[];

  /**
   * The JSON containing configuration properties
   */
  configurationProperties?: any;

  /**
   * The current status of this tenant.
   */
  status?: TenantStatus;

  /**
   * @deprecated use {@link #type}
   */
  sandbox?: boolean;
  type?: TenantType;
}
