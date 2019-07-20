import { DataSet, TenantConfiguration } from '../model/tenant-configuration';
import { TenantType } from '../model/tenant-type';
import {
  flatten,
  FlattenCustomizer,
  unflatten,
  UnflattenCustomizer
} from '../../../shared/support/support';
import { isEmpty } from 'lodash';

const joinIfArrayOfPrimitives: FlattenCustomizer = (
  result,
  object,
  property
) => {
  if (Array.isArray(object) && object.every(value => Object(value) !== value)) {
    result[property] = object.join(',');
    return true;
  }
  return false;
};

const splitIfNonPasswordCommaJoinedString: UnflattenCustomizer = (
  value,
  key
) => {
  if (
    !key.includes('password') &&
    typeof value === 'string' &&
    value.includes(',')
  ) {
    const array = value.split(',');
    if (array.every(element => Object(element) !== element)) {
      return array.map(element =>
        typeof element === 'string' ? element.trim() : element
      );
    }
  }
  return value;
};

export function defaultTenant(
  type: TenantType,
  configurationProperties: any,
  localizationOverrides: any,
  tenant?: TenantConfiguration,
  dataSet?: DataSet
) {
  return type === 'SANDBOX'
    ? {
        type,
        configurationProperties,
        localizationOverrides,
        label: tenant.label + ' Sandbox',
        parentTenantCode: tenant.code,
        dataSet
      }
    : {
        type,
        configurationProperties,
        localizationOverrides
      };
}

export function toTenant(
  serverTenant: any,
  defaults: any,
  dataSets: DataSet[] = []
): TenantConfiguration {
  const {
    tenant: {
      key: code,
      id,
      name: label,
      description,
      sandbox,
      sandboxDataset: dataSetId
    },
    administrationStatus: { tenantAdministrationStatus: status },
    parentTenantKey: parentTenantCode,
    localization: localizationOverrides
  } = serverTenant;

  const type = sandbox ? 'SANDBOX' : 'TENANT';
  return {
    code,
    id,
    label,
    description,
    type,
    status,
    configurationProperties: toConfigurations(serverTenant, type),
    localizationOverrides: localizationOverrides || {},
    parentTenantCode,
    dataSet: (dataSets || []).find(dataSet => dataSetId === dataSet.id)
  };
}

/**
 * This method filters out irrelevant fields and flattens the tree structure provided by the API
 *
 * @param properties
 * @param type
 */
export function toConfigurations(
  { archive, aggregate, datasources, reporting }: any,
  type
): any {
  return flatten(
    type === 'SANDBOX'
      ? {
          aggregate,
          reporting
        }
      : {
          archive,
          datasources,
          aggregate,
          reporting
        },
    joinIfArrayOfPrimitives
  );
}

// DO this at form submit time
export function toServerTenant(tenant: TenantConfiguration): any {
  const {
    code: key,
    id,
    label: name,
    description,
    type,
    parentTenantCode: parentTenantKey,
    dataSet: { id: sandboxDataset } = <any>{},
    configurationProperties,
    localizationOverrides: localization
  } = tenant;

  return {
    tenant: {
      key: key != null ? key.toUpperCase() : key,
      id,
      description,
      name,
      sandbox: type === 'SANDBOX',
      sandboxDataset
    },
    parentTenantKey,
    // this should be mapped back at form submit time
    ...unflatten(configurationProperties, splitIfNonPasswordCommaJoinedString),
    localization: isEmpty(localization) ? null : {}
  };
}

// /**
//  * Maps configuration properties back to the server side representation
//  *
//  * TODO this impl assumes max depth of props
//  *
//  * @param configProperties
//  */
// function toConfigurationPropertiesApiModel(configProperties: any): any {
//   const mappedGroup = {};
//
//   forOwn(configProperties, (group, groupKey) => {
//     if (groupKey === 'datasources') {
//       const datasourceGroup = {};
//
//       forOwn(group, (configurationProperties, datasourceKey) => {
//         const configGroup = {};
//         configurationProperties.forEach(
//           configurationProperty =>
//             (configGroup[configurationProperty.key] =
//               configurationProperty.value)
//         );
//         datasourceGroup[datasourceKey] = expand(configGroup);
//       });
//
//       mappedGroup[groupKey] = datasourceGroup;
//     } else {
//       const configGroup = {};
//       // group is the list of configuration properties
//       group.forEach(configurationProperty => {
//         if (
//           isString(configurationProperty.value) &&
//           configurationProperty.value.indexOf(',') > -1
//         ) {
//           configGroup[
//             configurationProperty.key
//           ] = configurationProperty.value.split(',');
//         } else {
//           configGroup[configurationProperty.key] = configurationProperty.value;
//         }
//       });
//       mappedGroup[groupKey] = configGroup;
//     }
//   });
//
//   return mappedGroup;
// }
//
// /**
//  * This creates configuration property models for each default property and applies the provided override on top of that
//  *
//  * TODO i feel it would be best to do this in the view as this is a view behavior concern and not a data modeling concern
//  *
//  * @param defaults
//  * @param overrides
//  */
// export function toConfigurationProperties(
//   defaults: any,
//   overrides: any = {}
// ): any {
//   const groupedProperties = {};
//
//   forOwn(defaults, (configGroup, groupKey) => {
//     if (groupKey !== 'datasources') {
//       const configProps: ConfigurationProperty[] = [];
//
//       forOwn(flattenJsonObject(configGroup), (value, key) => {
//         const defaultVal = joinIfArray(value);
//         if (!overrides) {
//           configProps.push(
//             new ConfigurationProperty(key, defaultVal, groupKey)
//           );
//         } else {
//           const groupOverrides = overrides[groupKey] || {};
//           const override = get(groupOverrides, key);
//           if (override) {
//             configProps.push(
//               new ConfigurationProperty(
//                 key,
//                 joinIfArray(override),
//                 groupKey,
//                 defaultVal
//               )
//             );
//           } else {
//             configProps.push(
//               new ConfigurationProperty(key, defaultVal, groupKey)
//             );
//           }
//         }
//       });
//
//       groupedProperties[groupKey] = configProps;
//     } else {
//       // current group is datasources
//       const databaseProps = {};
//
//       // Iterate over the group of databases
//       forOwn(configGroup, (databaseProperties, databaseName) => {
//         const configProps: ConfigurationProperty[] = [];
//
//         forOwn(flattenJsonObject(databaseProperties), (value, key) => {
//           const defaultVal = key === 'password' ? '' : joinIfArray(value);
//           if (!overrides) {
//             configProps.push(
//               new ConfigurationProperty(key, defaultVal, databaseName)
//             );
//           } else {
//             const groupOverrides = overrides[groupKey] || {};
//             const override = get(groupOverrides, `${databaseName}.${key}`);
//             if (override) {
//               configProps.push(
//                 new ConfigurationProperty(
//                   key,
//                   joinIfArray(override),
//                   databaseName,
//                   defaultVal
//                 )
//               );
//             } else {
//               configProps.push(
//                 new ConfigurationProperty(key, defaultVal, databaseName)
//               );
//             }
//           }
//         });
//
//         databaseProps[databaseName] = configProps;
//       });
//
//       groupedProperties[groupKey] = databaseProps;
//     }
//   });
//   return groupedProperties;
// }
//
// export function getModifiedConfigProperties(configProperties: any): any {
//   const modifiedProperties = {};
//   forOwn(configProperties, (group, key) => {
//     const props = <ConfigurationProperty[]>group;
//     if (props.some !== undefined) {
//       if (props.some(x => x.originalValue !== x.value)) {
//         modifiedProperties[key] = props.filter(
//           x => x.originalValue !== x.value
//         );
//       }
//     } else {
//       // Not an array of config props, must be a sub group, i.e. datasources.reporting_rw
//       modifiedProperties[key] = getModifiedConfigProperties(group);
//     }
//   });
//   return modifiedProperties;
// }
//
// function localizationToConfigurationProperties(
//   overrides: any
// ): ConfigurationProperty[] {
//   const flattenedOverrides = flattenJsonObject(overrides);
//   const configProperties: ConfigurationProperty[] = [];
//   forOwn(flattenedOverrides, (value, key) =>
//     configProperties.push(new ConfigurationProperty(key, value))
//   );
//   return configProperties;
// }
//
// function toLocalizationOverridesApiModel(
//   overrides: ConfigurationProperty[]
// ): any {
//   const flattenedOverrides = overrides
//     ? overrides.reduce((localizationOverrides, { key, value }) => {
//         localizationOverrides[key] = value;
//         return localizationOverrides;
//       }, {})
//     : [];
//
//   return expand(flattenedOverrides);
// }
//
// function joinIfArray(value: any): string {
//   return Array.isArray(value) ? value.join(',') : value;
// }
