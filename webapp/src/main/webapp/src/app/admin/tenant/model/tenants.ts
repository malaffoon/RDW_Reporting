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
import { configurationFormFields } from './field-configurations';

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
  { aggregate, archive, datasources, reporting }: any,
  type
): any {
  // adds in all the missing fields from the sparse set provided by the backend
  // these will later be used to fill in the configurations form
  // the reason this is done here for now is to have the change propagate
  // ideally this would only be a concern of the form
  const backfilledConfigurations = {
    ...configurationFormFields,
    aggregate,
    archive,
    datasources,
    reporting
  };

  const flattenedConfigurations = flatten(
    backfilledConfigurations,
    composeFlattenCustomizers(
      omitKeys('aggregate.tenants'),
      ignoreArraysOfPrimitives,
      // collapse this field into one
      ignoreKeys(key => key.startsWith('reporting.state')),
      normalizePrimitives
    )
  );

  if (type === 'SANDBOX') {
    delete flattenedConfigurations.archive;
    delete flattenedConfigurations.datasources;
  }

  return flattenedConfigurations;
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
    ...unflatten(configurations, trimStrings),
    localization: isEmpty(localization) ? null : unflatten(localization)
  });
}
