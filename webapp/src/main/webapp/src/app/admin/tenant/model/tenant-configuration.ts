import { ConfigurationProperty } from './configuration-property';
import { TenantStatus } from './tenant-status';
import { TenantType } from './tenant-type';

/**
 * Holds information regarding an RDW sandbox configuration
 */
export interface TenantConfiguration {
  /**
   * The tenant type
   */
  type?: TenantType;

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
   * The data template initially used to create the sandbox
   */
  dataSet?: DataSet;

  /**
   * The parent tenant code this sandbox is for.
   */
  parentTenantCode?: string;
}

export interface DataSet {
  /**
   * The unique key for a given data template
   */
  id: string;

  /**
   * A more human-readable label for a data template
   */
  label: string;
}
