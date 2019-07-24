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
import { normalizeFieldValue } from './fields';

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

export function normalizePrimitives(result, object, property): any {
  if (object == null || !isObject(object)) {
    result[property] = normalizeFieldValue(property, object);
    return true;
  }
  return false;
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
  { archive, aggregate, datasources, reporting }: any,
  type
): any {
  // TODO later we should have some matadata interpretation of this structure possibly
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
          reporting: {
            ...reporting,
            studentFields: {
              Gender: 'enabled',
              EconomicDisadvantage: 'Admin',
              PrimaryLanguage: 'admin'
            }
          }
        },
    composeFlattenCustomizers(
      omitKeys('aggregate.tenants'),
      ignoreArraysOfPrimitives,
      // collapse this field into one
      ignoreKeys(key => key.startsWith('reporting.state')),
      normalizePrimitives
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

  return {
    tenant: {
      key: (key != null ? key.toUpperCase() : key).trim(),
      id: id.trim(),
      description: description != null ? description.trim() : null,
      name: name.trim(),
      sandbox: type === 'SANDBOX',
      sandboxDataset
    },
    parentTenantKey,
    ...unflatten(configurations, trimStrings),
    localization: isEmpty(localization) ? null : unflatten(localization)
  };
}
