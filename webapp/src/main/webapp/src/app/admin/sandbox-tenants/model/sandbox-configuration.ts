/**
 * Holds information regarding an RDW sandbox configuration
 */
import { ConfigurationProperty } from './configuration-property';

export interface SandboxConfiguration {
  /**
   * The unique (generated) key for the sandbox
   */
  code: string;

  /**
   * A human readable label, name, or description of the sandbox
   */
  label: string;

  /**
   * Optional additional description of the sandbox configuration
   */
  description?: string;

  /**
   * The data template initially used to create the sandbox
   */
  dataSet: DataSet;

  /**
   * The map containing text/i18n overrides
   */
  localizationOverrides?: ConfigurationProperty[];

  /**
   * The map containing key/value pairings of configuration properties
   */
  configurationProperties?: ConfigurationProperty[];
}

export interface DataSet {
  /**
   * The unique key for a given data template
   */
  key: string;

  /**
   * A more human-readable label for a data template
   */
  label: string;
}
