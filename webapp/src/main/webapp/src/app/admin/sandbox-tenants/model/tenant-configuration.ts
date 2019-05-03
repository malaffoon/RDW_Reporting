/**
 * Holds information regarding an RDW sandbox configuration
 */
import { ConfigurationProperty } from './configuration-property';

export interface TenantConfiguration {
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
   * The map containing text/i18n overrides
   */
  localizationOverrides?: ConfigurationProperty[];

  /**
   * The map containing key/value pairings of configuration properties
   */
  configurationProperties?: ConfigurationProperty[];
}
