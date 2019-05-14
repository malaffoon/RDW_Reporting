import { ConfigurationProperty } from '../model/configuration-property';
import { flattenJsonObject } from '../../../shared/support/support';
import { forOwn, get } from 'lodash';
import { TenantConfiguration } from '../model/tenant-configuration';
import { SandboxConfiguration } from '../model/sandbox-configuration';

export function mapTenant(tenant: any): TenantConfiguration {
  return <TenantConfiguration>{
    code: tenant.tenant['key'],
    label: tenant.tenant['name'],
    description: tenant.tenant['description'],
    configurationProperties: mapConfigurationProperties(
      tenant.configurationProperties,
      tenant.tenantOverrides.configurationProperties
    )
  };
}

export function mapSandbox(sandbox: any): SandboxConfiguration {
  return <SandboxConfiguration>{
    code: sandbox.tenant['key'],
    label: sandbox.tenant['name'],
    description: sandbox.tenant['description'],
    dataSet: {
      //TODO: Do not hardcode this
      key: 'dataSet2',
      label: 'SBAC Interim Data Set'
    },
    configurationProperties: mapConfigurationProperties(
      sandbox.configurationProperties,
      sandbox.tenantOverrides.configurationProperties
    )
  };
}

function mapConfigurationProperties(
  configProperties: any,
  overrides: any
): any {
  let groupedProperties = {};

  forOwn(configProperties, (configGroup, groupKey) => {
    if (groupKey !== 'datasources') {
      let configProps: ConfigurationProperty[] = [];

      forOwn(flattenJsonObject(configGroup), (value, key) => {
        let groupOverrides = overrides[groupKey] || {};
        let override = get(groupOverrides, key);
        if (override) {
          configProps.push(new ConfigurationProperty(key, override, value));
        } else {
          configProps.push(new ConfigurationProperty(key, value));
        }
      });

      groupedProperties = {
        ...groupedProperties,
        [groupKey]: configProps
      };
    } else {
      // current group is datasources
      let databaseProps = {};

      // Iterate over the group of databases
      forOwn(configGroup, (databaseProperties, databaseName) => {
        let configProps: ConfigurationProperty[] = [];

        forOwn(flattenJsonObject(databaseProperties), (value, key) => {
          let groupOverrides = overrides[groupKey] || {};
          let override = get(groupOverrides, `${databaseName}.${key}`);
          if (override) {
            configProps.push(new ConfigurationProperty(key, override, value));
          } else {
            configProps.push(new ConfigurationProperty(key, value));
          }
        });

        databaseProps = {
          ...databaseProps,
          [databaseName]: configProps
        };
      });

      groupedProperties = {
        ...groupedProperties,
        [groupKey]: databaseProps
      };
    }
  });

  return groupedProperties;
}
