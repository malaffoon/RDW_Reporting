import { DataSet, TenantConfiguration } from '../model/tenant-configuration';
import { TenantType } from '../model/tenant-type';
import {
  flatten,
  FlattenCustomizer,
  unflatten,
  UnflattenCustomizer,
  valued
} from '../../../shared/support/support';
import { isEmpty, isObject } from 'lodash';

export const joinIfArrayOfPrimitives: FlattenCustomizer = (
  result,
  object,
  property
) => {
  if (
    Array.isArray(object) &&
    (object.length === 0 || object.every(value => !isObject(value)))
  ) {
    result[property] = object.join(',');
    return true;
  }
  return false;
};

export const splitIfNonPasswordCommaJoinedString: UnflattenCustomizer = (
  value,
  key
) => {
  if (
    // could this be placed somewhere better? so it can be controlled by metadata
    !key.endsWith('password') &&
    typeof value === 'string' &&
    value.includes(',')
  ) {
    const array = value.split(',');
    if (array.every(element => !isObject(element))) {
      return array.map(element =>
        typeof element === 'string' ? element.trim() : element
      );
    }
  }
  return value;
};

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
  return {
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
    // this should be mapped back at form submit time
    ...unflatten(configurations, splitIfNonPasswordCommaJoinedString),
    localization: isEmpty(localization) ? null : unflatten(localization)
  };
}
