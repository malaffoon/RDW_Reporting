/**
 * Holds information regarding an RDW tenant configuration
 */
import { ConfigurationProperty } from './configuration-property';

export interface TenantConfiguration {
  /**
   * The unique (generated) key for the tenant
   */
  code: string;

  /**
   * A human readable label, name, or description of the tenant
   */
  label: string;

  /**
   * Optional additional description of the tenant configuration
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
