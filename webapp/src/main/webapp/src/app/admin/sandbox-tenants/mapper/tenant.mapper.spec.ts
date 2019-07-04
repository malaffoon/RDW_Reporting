import {
  mapTenant,
  toTenantApiModel,
  mapSandbox,
  toSandboxApiModel
} from './tenant.mapper';
import { ConfigurationProperty } from '../model/configuration-property';
import { TenantConfiguration } from '../model/tenant-configuration';
import { SandboxConfiguration } from '../model/sandbox-configuration';

const tenantApiModel = {
  tenant: {
    id: 'CA',
    description: 'ca description',
    key: 'CALICODE',
    name: 'California',
    sandbox: false
  },
  administrationStatus: 'ACTIVE',
  datasources: { reporting_rw: { urlParts: { database: 'reporting' } } }
};
const sandboxApiModel = {
  tenant: {
    id: 'CA',
    sandboxDataset: 'ca-demo-data',
    description: 'ca description',
    key: 'CA_S132',
    name: 'CA-Sandbox',
    sandbox: true
  },
  administrationStatus: 'ACTIVE',
  datasources: { reporting_rw: { urlParts: { database: 'reporting' } } }
};
const defaultsApiModel = {
  datasources: {
    reporting_rw: {
      urlParts: { database: 'not_a_schema', protocol: 'jdbc:mysql:' }
    }
  }
};

const dataSets = [
  { id: 'ca-demo-data', label: 'CA Demo Data' },
  { id: 'az-demo-data', label: 'AZ Demo Data' }
];

const tenantUIModel: TenantConfiguration = {
  label: 'Arizona',
  code: 'AZ',
  description: 'AZ description',
  id: '34',
  configurationProperties: {
    datasources: {
      reporting_rw: [
        {
          key: 'urlParts.database',
          value: 'new-reporting',
          originalValue: 'not_a_schema',
          group: 'reporting_rw',
          formControlName: 'reporting_rw.urlParts.database'
        },
        {
          key: 'urlParts.protocol',
          value: 'jdbc:mysql:',
          originalValue: 'jdbc:mysql:',
          group: 'reporting_rw',
          formControlName: 'reporting_rw.urlParts.protocol'
        }
      ]
    }
  }
};

const sandboxUIModel: SandboxConfiguration = {
  ...tenantUIModel,
  dataSet: dataSets[0]
};

describe('Tenant mapper', () => {
  it('should map a tenant from the api', () => {
    const actual = mapTenant(tenantApiModel, {});

    expect(actual.label).toBe('California');
    expect(actual.code).toBe('CALICODE');
    expect(actual.description).toBe('ca description');
    expect(actual.id).toBe('CA');
    expect(actual.localizationOverrides).toBeDefined();
    expect(actual.configurationProperties).toBeDefined();
  });

  it('should merge tenant and default configurations', () => {
    const actual = mapTenant(tenantApiModel, defaultsApiModel);
    const reporting_rw =
      actual.configurationProperties.datasources.reporting_rw;
    const actualOverride: ConfigurationProperty = reporting_rw.find(
      x => x.key === 'urlParts.database'
    );

    expect(actualOverride.value).toBe('reporting');
    expect(actualOverride.originalValue).toBe('not_a_schema');

    const actualDefault: ConfigurationProperty = reporting_rw.find(
      x => x.key === 'urlParts.protocol'
    );
    expect(actualDefault.value).toBe('jdbc:mysql:');
    expect(actualDefault.originalValue).toBe('jdbc:mysql:');
  });

  it('should map a tenant ui model to an api model', () => {
    const actual = toTenantApiModel(tenantUIModel);

    expect(actual.tenant.name).toBe('Arizona');
    expect(actual.tenant.id).toBe('34');
    expect(actual.tenant.description).toBe('AZ description');
    expect(actual.tenant.key).toBe('AZ');
  });

  it('should map tenant ui config props to api config props', () => {
    const actual = toTenantApiModel(tenantUIModel);

    expect(actual.datasources.reporting_rw.urlParts.database).toBe(
      'new-reporting'
    );

    //TODO: Should we be sending back unchanged values?
    expect(actual.datasources.reporting_rw.urlParts.protocol).toBe(
      'jdbc:mysql:'
    );
  });

  it('should map a sandbox from the api', () => {
    const actual = mapSandbox(sandboxApiModel, {}, dataSets);
    expect(actual.dataSet.label).toBe('CA Demo Data');

    expect(actual.label).toBe('CA-Sandbox');
    expect(actual.code).toBe('CA_S132');
    expect(actual.description).toBe('ca description');
    expect(actual.id).toBe('CA');
    expect(actual.localizationOverrides).toBeDefined();
    expect(actual.configurationProperties).toBeDefined();
  });

  it('should merge sandbox and default configurations', () => {
    const actual = mapSandbox(sandboxApiModel, defaultsApiModel, dataSets);
    const reporting_rw =
      actual.configurationProperties.datasources.reporting_rw;
    const actualOverride: ConfigurationProperty = reporting_rw.find(
      x => x.key === 'urlParts.database'
    );

    expect(actualOverride.value).toBe('reporting');
    expect(actualOverride.originalValue).toBe('not_a_schema');

    const actualDefault: ConfigurationProperty = reporting_rw.find(
      x => x.key === 'urlParts.protocol'
    );
    expect(actualDefault.value).toBe('jdbc:mysql:');
    expect(actualDefault.originalValue).toBe('jdbc:mysql:');
  });

  it('should map a sandbox ui model to an api model', () => {
    const actual = toSandboxApiModel(sandboxUIModel);

    expect(actual.tenant.sandboxDataset).toBe('ca-demo-data');
    expect(actual.tenant.name).toBe('Arizona');
    expect(actual.tenant.id).toBe('34');
    expect(actual.tenant.description).toBe('AZ description');
    expect(actual.tenant.key).toBe('AZ');
  });

  it('should map sandbox ui config props to api config props', () => {
    const actual = toSandboxApiModel(sandboxUIModel);

    expect(actual.datasources.reporting_rw.urlParts.database).toBe(
      'new-reporting'
    );

    //TODO: Should we be sending back unchanged values?
    expect(actual.datasources.reporting_rw.urlParts.protocol).toBe(
      'jdbc:mysql:'
    );
  });
});
