import { TenantConfiguration } from './tenant-configuration';

/**
 * Holds information regarding an RDW sandbox configuration
 */
export interface SandboxConfiguration extends TenantConfiguration {
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
