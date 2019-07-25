import { DataSet, TenantConfiguration } from '../model/tenant-configuration';
import { TenantType } from '../model/tenant-type';
import {
  composeFlattenCustomizers,
  flatten,
  FlattenCustomizer,
  unflatten,
  valued
} from '../../../shared/support/support';
import { isEmpty, isObject, mapValues } from 'lodash';
import { fieldConfiguration, normalizeFieldValue } from './fields';

export function trimStrings(value: any): any {
  if (typeof value === 'string') {
    return value.trim();
  }
  return value;
}

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

export function omitKeys(...keys: string[]): FlattenCustomizer {
  return function(result, object, property) {
    if (keys.includes(property)) {
      return true;
    }
    return false;
  };
}

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
  { aggregate, archive, datasources, reporting }: any,
  type
): any {
  const relevantConfigurations =
    type === 'SANDBOX'
      ? {
          aggregate,
          reporting
        }
      : {
          aggregate,
          archive,
          datasources,
          reporting
        };

  return normalize(
    flatten(
      relevantConfigurations,
      composeFlattenCustomizers(
        // TODO normalize values here?
        omitKeys('aggregate.tenants'),
        ignoreArraysOfPrimitives,
        // collapse this field into one
        ignoreKeys(key => key.startsWith('reporting.state'))
      )
    )
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

  return valued({
    tenant: {
      key: key != null ? key.toUpperCase().trim() : null,
      id: id != null ? id.trim() : null,
      description: description != null ? description.trim() : null,
      name: name != null ? name.trim() : null,
      sandbox: type === 'SANDBOX',
      sandboxDataset
    },
    parentTenantKey,
    ...toServerConfigurations(configurations),
    localization: isEmpty(localization) ? null : unflatten(localization)
  });
}

export function toServerConfigurations(configurations: any): any {
  return unflatten(lowercase(configurations), trimStrings);
}

/**
 * Utility to force some form fields into their required lower case form
 */
function lowercase(values: { [key: string]: any }): { [key: string]: any } {
  return Object.entries(values).reduce((lowercased, [key, value]) => {
    lowercased[key] =
      fieldConfiguration(key) && value != null && typeof value === 'string'
        ? value.toLowerCase()
        : value;
    return lowercased;
  }, {});
}

function normalize(configurations: any): any {
  return Object.entries(configurations).reduce((normalized, [key, value]) => {
    normalized[key] = normalizeFieldValue(key, value);
    return normalized;
  }, {});
}
