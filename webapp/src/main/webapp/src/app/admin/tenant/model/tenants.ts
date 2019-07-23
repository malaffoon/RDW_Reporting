import { DataSet, TenantConfiguration } from '../model/tenant-configuration';
import { TenantType } from '../model/tenant-type';
import {
  composeFlattenCustomizers,
  composeUnflattenCustomizers,
  flatten,
  FlattenCustomizer,
  unflatten,
  UnflattenCustomizer,
  valued
} from '../../../shared/support/support';
import { isEmpty, isObject, omit } from 'lodash';

// function mapToString(value: any): string {
//   return Object.entries(value)
//     .map(entries => entries.join(':'))
//     .join(',');
// }
//
// function stringToMap(value: string): any {
//   value.split(',').reduce((map, entry) => {
//     const [key, value] = entry.split(':');
//     map[key] = value;
//     return map;
//   }, {});
// }

// export function mapToStringCustomizer(
//   ...properties: string[]
// ): FlattenCustomizer {
//   return function(result, object, property) {
//     if (properties.includes(property)) {
//       result[property] = mapToString(object);
//       return true;
//     }
//     return false;
//   };
// }

// export function stringToMapCustomizer(
//   ...properties: string[]
// ): UnflattenCustomizer {
//   return function(value, property) {
//     if (properties.includes(property)) {
//       return stringToMap(value);
//     }
//     return value;
//   };
// }

/**
 * If it finds a value that is an array of primitives it joins it.
 * If it finds an empty array it returns an empty string
 *
 * @param result
 * @param object
 * @param property
 */
export const ignoreArraysOfPrimitives: FlattenCustomizer = (
  result,
  object,
  property
) => {
  if (
    Array.isArray(object) &&
    (object.length === 0 || object.every(value => !isObject(value)))
  ) {
    result[property] = object;
    return true;
  }
  return false;
};

export function ignoreKeys(
  keyMatcher: (key: string) => boolean
): FlattenCustomizer {
  return function(result, object, property) {
    if (keyMatcher(property)) {
      result[property] = object;
      return true;
    }
    return false;
  };
}

// export const splitIfNonPasswordCommaJoinedString: UnflattenCustomizer = (
//   value,
//   key
// ) => {
//   if (
//     // could this be placed somewhere better? so it can be controlled by metadata
//     !key.endsWith('password') &&
//     typeof value === 'string' &&
//     value.includes(',')
//   ) {
//     const array = value.split(',');
//     if (array.every(element => !isObject(element))) {
//       return array.map(element =>
//         typeof element === 'string' ? element.trim() : element
//       );
//     }
//   }
//   return value;
// };

export function defaultTenant(
  type: TenantType,
  configurations: any,
  localizations: any,
  tenant?: TenantConfiguration,
  dataSet?: DataSet
) {
  return type === 'SANDBOX'
    ? {
        type,
        configurations,
        localizations,
        label: tenant.label + ' Sandbox',
        parentTenantCode: tenant.code,
        dataSet
      }
    : {
        type,
        configurations,
        localizations
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
    localization: localizations
  } = serverTenant;

  const type = sandbox ? 'SANDBOX' : 'TENANT';
  return valued({
    code,
    id,
    label,
    description,
    type,
    status,
    configurations: valued(toConfigurations(serverTenant, type)),
    localizations: valued(flatten(localizations || {})),
    parentTenantCode,
    dataSet: (dataSets || []).find(dataSet => dataSetId === dataSet.id)
  });
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
  // TODO later we should have some matadata interpretation of this structure possibly
  return omit(
    flatten(
      type === 'SANDBOX'
        ? {
            aggregate,
            reporting
          }
        : {
            archive,
            datasources,
            aggregate,
            reporting: {
              ...reporting,
              studentFields: {
                Gender: 'enabled',
                EconomicDisadvantage: 'admin'
              }
            }
          },
      composeFlattenCustomizers(
        ignoreArraysOfPrimitives,
        // we are going to collapse this..
        ignoreKeys(key => key.startsWith('reporting.state'))
      )
    ),
    // remove tenant specific aggregate settings
    'aggregate.tenants'
  );
}

export function toServerTenant(tenant: TenantConfiguration): any {
  const {
    code: key,
    id,
    label: name,
    description,
    type,
    parentTenantCode: parentTenantKey,
    dataSet: { id: sandboxDataset } = <any>{},
    configurations,
    localizations: localization
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
    ...unflatten(
      configurations
      // splitIfNonPasswordCommaJoinedString,
    ),
    localization: isEmpty(localization) ? null : unflatten(localization)
  };
}
