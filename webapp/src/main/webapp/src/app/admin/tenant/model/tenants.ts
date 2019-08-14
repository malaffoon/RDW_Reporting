import { DataSet, TenantConfiguration } from '../model/tenant-configuration';
import { TenantType } from '../model/tenant-type';
import {
  composeFlattenCustomizers,
  flatten,
  FlattenCustomizer,
  unflatten,
  valued
} from '../../../shared/support/support';
import { isEmpty, isObject, transform } from 'lodash';
import { fieldConfiguration } from './fields';

/**
 * Utility to force some form fields into their required lower case form
 */
function lowercase(object: { [key: string]: any }): { [key: string]: any } {
  return transform(
    object,
    (result: any, value: any, key: string) => {
      result[key] =
        fieldConfiguration(key).lowercase &&
        value != null &&
        typeof value === 'string'
          ? value.toLowerCase()
          : value;
    },
    {}
  );
}

function trimStrings(object: any): any {
  return transform(
    object,
    (result: any, value: any, key: string) => {
      result[key] = typeof value === 'string' ? value.trim() : value;
    },
    {}
  );
}

function omitByKey(object: any, matcher: (key: string) => boolean): any {
  return transform(
    object,
    (result: any, value: any, key: string) => {
      if (!matcher(key)) {
        result[key] = value;
      }
    },
    {}
  );
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

export function defaultTenant(
  type: TenantType,
  tenant?: TenantConfiguration,
  dataSet?: DataSet
): TenantConfiguration {
  const configurations = {};
  const localizations = {};
  return type === 'SANDBOX'
    ? {
        type,
        label: tenant.label + ' Sandbox',
        parentTenantCode: tenant.code,
        dataSet,
        configurations,
        localizations
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
    configurations: toConfigurations(serverTenant, type),
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
  {
    aggregate,
    archive,
    artClient,
    datasources,
    importServiceClient,
    reporting,
    sendReconciliationReport
  }: any,
  type: TenantType
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
          artClient,
          datasources,
          importServiceClient,
          reporting,
          sendReconciliationReport
        };

  // TODO this valued filter wont be needed after the api update
  return valued(
    flatten(
      relevantConfigurations,
      composeFlattenCustomizers(
        // TODO normalize values here?
        ignoreArraysOfPrimitives,
        // collapse this field into one
        ignoreKeys(key => key.startsWith('reporting.state'))
      )
    )
  );
}

export function toDefaultConfigurations(defaults: any, type: TenantType): any {
  return omitByKey(toConfigurations(defaults, type), key =>
    // blank out any defaults for these fields
    /^(aggregate\.tenant|datasources\.\w+\.(username|password|urlParts\.database|schemaSearchPath))$/.test(
      key
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
  const serverConfigurations = unflatten(
    lowercase(trimStrings(configurations))
  );

  // Remove empty archive configurations
  const {
    sendReconciliationReport: { archives } = <any>{}
  } = serverConfigurations;
  if (archives != null) {
    serverConfigurations.sendReconciliationReport.archives = archives.filter(
      archive => Object.keys(archive).length > 0
    );
  }

  return serverConfigurations;
}
