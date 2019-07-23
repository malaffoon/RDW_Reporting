import { joinIfArrayOfPrimitives, toConfigurations, toTenant } from './tenants';
import { activeSandbox, activeTenant, dataSets } from './tenants.spec.data';
import { flatten, valued } from '../../../shared/support/support';
import { TenantConfiguration } from './tenant-configuration';
import { TenantStatus } from './tenant-status';

describe('toConfigurations', () => {
  it('should prune based on tenant type SANDBOX', () => {
    expect(
      toConfigurations(
        {
          irrelevant: {},
          archive: {},
          aggregate: {},
          datasources: {},
          reporting: {}
        },
        'SANDBOX'
      )
    ).toEqual({
      aggregate: {},
      reporting: {}
    });
  });

  it('should prune based on tenant type TENANT', () => {
    expect(
      toConfigurations(
        {
          irrelevant: {},
          archive: {},
          aggregate: {},
          datasources: {},
          reporting: {}
        },
        'TENANT'
      )
    ).toEqual({
      archive: {},
      aggregate: {},
      datasources: {},
      reporting: {}
    });
  });
});

describe('toTenant', () => {
  it('should correctly map SANDBOX without error', () => {
    const expected: TenantConfiguration = {
      id: activeSandbox.tenant.id,
      code: activeSandbox.tenant.key,
      label: activeSandbox.tenant.name,
      description: activeSandbox.tenant.description,
      type: 'SANDBOX',
      status: <TenantStatus>(
        activeSandbox.administrationStatus.tenantAdministrationStatus
      ),
      parentTenantCode: activeSandbox.parentTenantKey,
      dataSet: {
        id: activeSandbox.tenant.sandboxDataset,
        label: 'ds1'
      },
      configurations: valued(
        flatten(
          {
            aggregate: activeSandbox.aggregate,
            reporting: activeSandbox.reporting
          },
          joinIfArrayOfPrimitives
        )
      ),
      localizations: valued(flatten(activeSandbox.localization || {}))
    };

    expect(toTenant(activeSandbox, {}, dataSets)).toEqual(expected);
  });

  it('should correctly map TENANT without error', () => {
    const expected: TenantConfiguration = {
      id: activeTenant.tenant.id,
      code: activeTenant.tenant.key,
      label: activeTenant.tenant.name,
      description: activeTenant.tenant.description,
      type: 'TENANT',
      status: <TenantStatus>(
        activeTenant.administrationStatus.tenantAdministrationStatus
      ),
      configurations: valued(
        flatten(
          {
            archive: activeTenant.archive,
            aggregate: activeTenant.aggregate,
            datasources: activeTenant.datasources,
            reporting: activeTenant.reporting
          },
          joinIfArrayOfPrimitives
        )
      ),
      localizations: valued(flatten(activeTenant.localization || {}))
    };

    expect(toTenant(activeTenant, {}, dataSets)).toEqual(expected);
  });
});

describe('toServerTenant', () => {});