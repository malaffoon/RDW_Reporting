import { ConfigurationProperty } from '../model/configuration-property';
import { flattenJsonObject } from '../../../shared/support/support';
import { forOwn, get } from 'lodash';
import { TenantConfiguration } from '../model/tenant-configuration';
import { SandboxConfiguration } from '../model/sandbox-configuration';

export function mapTenant(
  tenant: any,
  defaultApplicationTenantConfiguration: any
): TenantConfiguration {
  return <TenantConfiguration>{
    code: tenant.tenant['key'],
    label: tenant.tenant['name'],
    description: tenant.tenant['description'],
    configurationProperties: mapConfigurationProperties(
      defaultApplicationTenantConfiguration,
      tenant.applicationTenantConfiguration
    ),
    localizationOverrides: [
      //TODO: Map localization overrides
    ]
  };
}

export function mapSandbox(
  sandbox: any,
  defaultApplicationTenantConfiguration: any
): SandboxConfiguration {
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
      defaultApplicationTenantConfiguration,
      sandbox.applicationTenantConfiguration
    ),
    localizationOverrides: [
      //TODO: Map localization overrides
    ]
  };
}

export function mapFromSandbox(sandbox: SandboxConfiguration): any {
  return {
    tenantConfiguration: {
      tenant: {
        key: sandbox.code,
        id: sandbox.code,
        description: sandbox.description,
        name: sandbox.label
      },
      applicationTenantConfiguration: mapFromConfigurationProperties(
        sandbox.configurationProperties
      ),
      localizationOverrides: {
        //TODO: Map localization overrides
      }
    }
  };
}

function mapFromConfigurationProperties(configProperties: any): any {
  let mappedGroup = {};

  forOwn(configProperties, (group, groupKey) => {
    if (groupKey === 'datasources') {
      let datasourceGroup = {};

      forOwn(group, (configurationProperties, datasourceKey) => {
        let configGroup = {};
        configurationProperties.forEach(
          configurationProperty =>
            (configGroup[configurationProperty.key] =
              configurationProperty.value)
        );
        datasourceGroup[datasourceKey] = configGroup;
      });

      mappedGroup[groupKey] = datasourceGroup;
    } else {
      let configGroup = {};
      // group is the list of configuration properties
      group.forEach(
        configurationProperty =>
          (configGroup[configurationProperty.key] = configurationProperty.value)
      );
      mappedGroup[groupKey] = configGroup;
    }
  });

  return mappedGroup;
}

export function mapConfigurationProperties(
  configProperties: any,
  overrides: any = {}
): any {
  let groupedProperties = {};

  forOwn(configProperties, (configGroup, groupKey) => {
    if (groupKey !== 'datasources') {
      let configProps: ConfigurationProperty[] = [];

      forOwn(flattenJsonObject(configGroup), (value, key) => {
        if (!overrides) {
          configProps.push(new ConfigurationProperty(key, value));
        } else {
          const groupOverrides = overrides[groupKey] || {};
          const override = get(groupOverrides, key);
          if (override) {
            configProps.push(new ConfigurationProperty(key, override, value));
          } else {
            configProps.push(new ConfigurationProperty(key, value));
          }
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
          if (!overrides) {
            configProps.push(new ConfigurationProperty(key, value));
          } else {
            const groupOverrides = overrides[groupKey] || {};
            const override = get(groupOverrides, `${databaseName}.${key}`);
            if (override) {
              configProps.push(new ConfigurationProperty(key, override, value));
            } else {
              configProps.push(new ConfigurationProperty(key, value));
            }
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
