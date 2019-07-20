import { OldConfigProp } from './old-config-prop';
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
   * The parent tenant code this sandbox is for.
   */
  parentTenantCode?: string;

  /**
   * The data template initially used to create the sandbox
   */
  dataSet?: DataSet;

  /**
   * Flat map of localization codes to messages
   */
  localizations: { [key: string]: string };

  /**
   * Flat map of configuration properties to values
   */
  configurations: { [key: string]: string | boolean | number };

  /**
   * The current status of this tenant.
   */
  status?: TenantStatus;
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
