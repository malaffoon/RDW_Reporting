import { TenantConfiguration } from './tenant-configuration';

/**
 * Holds information regarding an RDW sandbox configuration
 */
export interface SandboxConfiguration extends TenantConfiguration {
  /**
   * The data template initially used to create the sandbox
   */
  dataSet: DataSet;
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
