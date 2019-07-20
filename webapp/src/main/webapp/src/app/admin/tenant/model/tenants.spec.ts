import { OldConfigProp } from './old-config-prop';
import { TenantConfiguration } from '../model/tenant-configuration';
import {
  toTenant,
  toServerTenant,
  getModifiedConfigProperties
} from './tenants';

const tenantApiModel = {
  tenant: {
    id: 'CA',
    description: 'ca description',
    key: 'CALICODE',
    name: 'California',
    sandbox: false
  },
  administrationStatus: { tenantAdministrationStatus: 'ACTIVE' },
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
  reporting: { schoolYear: '2015' }
};
const defaultsApiModel = {
  reporting: { schoolYear: '2018', state: { name: 'CA' } },
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
  status: 'ACTIVE',
  configurations: {
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
    },
    reporting: [
      {
        key: 'state.name',
        originalValue: 'California',
        value: 'Florida',
        formControlName: 'reporting'
      }
    ],
    archive: [
      {
        key: 'prefix',
        originalValue: 's3://',
        value: 's3://',
        formControlName: 'archive'
      }
    ]
  }
};

const sandboxUIModel: TenantConfiguration = {
  ...tenantUIModel,
  parentTenantCode: 'CA_001',
  dataSet: dataSets[0]
};

describe('Tenant mapper', () => {
  it('should map a tenant from the api', () => {
    const actual = toTenant(tenantApiModel, {});

    expect(actual.label).toBe('California');
    expect(actual.code).toBe('CALICODE');
    expect(actual.description).toBe('ca description');
    expect(actual.id).toBe('CA');
    expect(actual.status).toBe('ACTIVE');
    expect(actual.localizations).toBeDefined();
    expect(actual.configurations).toBeDefined();
  });

  it('should merge tenant and default configurations', () => {
    const actual = toTenant(tenantApiModel, defaultsApiModel);
    const reporting_rw = actual.configurations.datasources.reporting_rw;
    const actualOverride: OldConfigProp = reporting_rw.find(
      x => x.key === 'urlParts.database'
    );

    expect(actualOverride.value).toBe('reporting');
    expect(actualOverride.originalValue).toBe('not_a_schema');

    const actualDefault: OldConfigProp = reporting_rw.find(
      x => x.key === 'urlParts.protocol'
    );
    expect(actualDefault.value).toBe('jdbc:mysql:');
    expect(actualDefault.originalValue).toBe('jdbc:mysql:');
  });

  it('should map a tenant ui model to an api model', () => {
    const actual = toServerTenant(tenantUIModel);

    expect(actual.tenant.name).toBe('Arizona');
    expect(actual.tenant.id).toBe('34');
    expect(actual.tenant.description).toBe('AZ description');
    expect(actual.tenant.key).toBe('AZ');
  });

  it('should map tenant ui config props to api config props', () => {
    const actual = toServerTenant(tenantUIModel);

    expect(actual.datasources.reporting_rw.urlParts.database).toBe(
      'new-reporting'
    );

    //TODO: Should we be sending back unchanged values?
    expect(actual.datasources.reporting_rw.urlParts.protocol).toBe(
      'jdbc:mysql:'
    );
  });

  it('should map a sandbox from the api', () => {
    const actual = toTenant(sandboxApiModel, {}, dataSets);
    expect(actual.dataSet.label).toBe('CA Demo Data');

    expect(actual.label).toBe('CA-Sandbox');
    expect(actual.code).toBe('CA_S132');
    expect(actual.description).toBe('ca description');
    expect(actual.id).toBe('CA');
    expect(actual.localizations).toBeDefined();
    expect(actual.configurations).toBeDefined();
  });

  it('should merge sandbox and default configurations', () => {
    const actual = toTenant(sandboxApiModel, defaultsApiModel, dataSets);
    const reporting = actual.configurations.reporting;

    const actualOverride: OldConfigProp = reporting.find(
      x => x.key === 'schoolYear'
    );
    expect(actualOverride.value).toBe('2015');
    expect(actualOverride.originalValue).toBe('2018');

    const actualDefault: OldConfigProp = reporting.find(
      x => x.key === 'state.name'
    );
    expect(actualDefault.value).toBe('CA');
    expect(actualDefault.originalValue).toBe('CA');
  });

  it('should not map sandbox dataset configurations', () => {
    const actual = toTenant(sandboxApiModel, defaultsApiModel, dataSets);
    expect(actual.configurations.datasources).toBeUndefined();
  });

  it('should map a sandbox ui model to an api model', () => {
    const actual = toServerTenant(sandboxUIModel);

    expect(actual.tenant.sandboxDataset).toBe('ca-demo-data');
    expect(actual.tenant.name).toBe('Arizona');
    expect(actual.tenant.id).toBe('34');
    expect(actual.tenant.description).toBe('AZ description');
    expect(actual.tenant.key).toBe('AZ');
  });

  it('should map sandbox ui config props to api config props', () => {
    const actual = toServerTenant(sandboxUIModel);

    expect(actual.datasources.reporting_rw.urlParts.database).toBe(
      'new-reporting'
    );

    //TODO: Should we be sending back unchanged values?
    expect(actual.datasources.reporting_rw.urlParts.protocol).toBe(
      'jdbc:mysql:'
    );
  });

  it('should get modified config properties', () => {
    const actual = getModifiedConfigProperties(tenantUIModel.configurations);

    const actualReportingDatasource = actual.datasources.reporting_rw;
    expect(actualReportingDatasource.length).toBe(1);

    const actualDatabase = actualReportingDatasource[0];
    expect(actualDatabase.key).toBe('urlParts.database');
    expect(actualDatabase.value).toBe('new-reporting');
    expect(actualDatabase.originalValue).toBe('not_a_schema');
    expect(actualDatabase.group).toBe('reporting_rw');

    const actualReporting = actual.reporting;
    expect(actualReporting.length).toBe(1);

    const actualStateName = actualReporting[0];
    expect(actualStateName.key).toBe('state.name');
    expect(actualStateName.value).toBe('Florida');
    expect(actualStateName.originalValue).toBe('California');
    expect(actualStateName.formControlName).toBe('reporting');

    expect(actual.archive).toBeUndefined();
  });
});
