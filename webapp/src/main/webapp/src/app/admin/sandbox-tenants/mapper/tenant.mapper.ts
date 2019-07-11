import { ConfigurationProperty } from '../model/configuration-property';
import { flattenJsonObject } from '../../../shared/support/support';
import { forOwn, get, isString } from 'lodash';
import { TenantConfiguration } from '../model/tenant-configuration';
import { DataSet, SandboxConfiguration } from '../model/sandbox-configuration';
import { object as expand } from 'dot-object';

export function mapTenant(
  tenantConfiguration: any,
  defaultApplicationTenantConfiguration: any,
  skipMappingConfigProperties?: boolean
): TenantConfiguration {
  const tenant = tenantConfiguration.tenant;
  return {
    code: tenant.key,
    id: tenant.id,
    label: tenant.name,
    description: tenant.description,
    configurationProperties: skipMappingConfigProperties
      ? toConfigProperties(tenantConfiguration)
      : mapConfigurationProperties(
          toConfigProperties(defaultApplicationTenantConfiguration),
          toConfigProperties(tenantConfiguration)
        ),
    localizationOverrides: mapLocalizationOverrides(tenant.localization)
  };
}

// helper to return only the config props of an api model.
export function toConfigProperties(apiModel: any): any {
  return {
    aggregate: apiModel.aggregate,
    archive: apiModel.archive,
    reporting: apiModel.reporting,
    ...(apiModel.datasources ? { datasources: apiModel.datasources } : {})
  };
}

export function mapSandbox(
  tenantConfiguration: any,
  defaultConfiguration: any,
  dataSets: DataSet[]
): SandboxConfiguration {
  // intentionally exclude datasources here.
  const defaults = {
    aggregate: defaultConfiguration.aggregate,
    archive: defaultConfiguration.archive,
    reporting: defaultConfiguration.reporting
  };
  return <SandboxConfiguration>{
    ...mapTenant(tenantConfiguration, defaults),
    parentTenantCode: tenantConfiguration.parentTenantKey,
    dataSet: dataSets.find(
      dataSet => tenantConfiguration.tenant.sandboxDataset === dataSet.id
    )
  };
}

export function toSandboxApiModel(sandbox: SandboxConfiguration): any {
  const apiModel = toTenantApiModel(sandbox);
  apiModel.tenant.sandboxDataset = sandbox.dataSet.id;
  apiModel.parentTenantKey = sandbox.parentTenantCode;
  return apiModel;
}

export function toTenantApiModel(tenant: TenantConfiguration): any {
  return {
    tenant: {
      key: tenant.code,
      id: tenant.id,
      description: tenant.description,
      name: tenant.label
    },
    ...toConfigurationPropertiesApiModel(tenant.configurationProperties),
    localization: toLocalizationOverridesApiModel(tenant.localizationOverrides)
  };
}

function toConfigurationPropertiesApiModel(configProperties: any): any {
  const mappedGroup = {};

  forOwn(configProperties, (group, groupKey) => {
    if (groupKey === 'datasources') {
      const datasourceGroup = {};

      forOwn(group, (configurationProperties, datasourceKey) => {
        const configGroup = {};
        configurationProperties.forEach(
          configurationProperty =>
            (configGroup[configurationProperty.key] =
              configurationProperty.value)
        );
        datasourceGroup[datasourceKey] = expand(configGroup);
      });

      mappedGroup[groupKey] = datasourceGroup;
    } else {
      const configGroup = {};
      // group is the list of configuration properties
      group.forEach(configurationProperty => {
        if (
          isString(configurationProperty.value) &&
          configurationProperty.value.indexOf(',') > -1
        ) {
          configGroup[
            configurationProperty.key
          ] = configurationProperty.value.split(',');
        } else {
          configGroup[configurationProperty.key] = configurationProperty.value;
        }
      });
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
      const configProps: ConfigurationProperty[] = [];

      forOwn(flattenJsonObject(configGroup), (value, key) => {
        const defaultVal = joinIfArray(value);
        if (!overrides) {
          configProps.push(
            new ConfigurationProperty(key, defaultVal, groupKey)
          );
        } else {
          const groupOverrides = overrides[groupKey] || {};
          const override = get(groupOverrides, key);
          if (override) {
            configProps.push(
              new ConfigurationProperty(
                key,
                joinIfArray(override),
                groupKey,
                defaultVal
              )
            );
          } else {
            configProps.push(
              new ConfigurationProperty(key, defaultVal, groupKey)
            );
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
        const configProps: ConfigurationProperty[] = [];

        forOwn(flattenJsonObject(databaseProperties), (value, key) => {
          const defaultVal = key === 'password' ? '' : joinIfArray(value);
          if (!overrides) {
            configProps.push(
              new ConfigurationProperty(key, defaultVal, databaseName)
            );
          } else {
            const groupOverrides = overrides[groupKey] || {};
            const override = get(groupOverrides, `${databaseName}.${key}`);
            if (override) {
              configProps.push(
                new ConfigurationProperty(
                  key,
                  joinIfArray(override),
                  databaseName,
                  defaultVal
                )
              );
            } else {
              configProps.push(
                new ConfigurationProperty(key, defaultVal, databaseName)
              );
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

function mapLocalizationOverrides(overrides: any): ConfigurationProperty[] {
  const flattenedOverrides = flattenJsonObject(overrides);
  const configProperties: ConfigurationProperty[] = [];
  forOwn(flattenedOverrides, (value, key) =>
    configProperties.push(new ConfigurationProperty(key, value))
  );
  return configProperties;
}

function toLocalizationOverridesApiModel(
  overrides: ConfigurationProperty[]
): any {
  const flattenedOverrides = overrides
    ? overrides.reduce((localizationOverrides, { key, value }) => {
        localizationOverrides[key] = value;
        return localizationOverrides;
      }, {})
    : [];

  return expand(flattenedOverrides);
}

function joinIfArray(value: any): string {
  return Array.isArray(value) ? value.join(',') : value;
}
