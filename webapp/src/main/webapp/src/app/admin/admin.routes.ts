import { Route } from '@angular/router';
import { HasAnyPermissionCanActivate } from '../shared/security/can-activate/has-any-permission.can-activate';
import { AggregateReportOptionsResolve } from '../aggregate-report/aggregate-report-options.resolve';

export const aggregateReportsLoadChildren = () =>
  import('app/aggregate-report/aggregate-reports.module').then(
    module => module.AggregateReportsModule
  );

export const embargoesLoadChildren = () =>
  import('app/admin/embargo/embargo.module').then(
    module => module.EmbargoModule
  );

export const organizationExportLoadChildren = () =>
  import('app/organization-export/organization-export.module').then(
    module => module.OrganizationExportModule
  );

export const groupsLoadChildren = () =>
  import('app/admin/groups/groups.module').then(module => module.GroupsModule);

export const instructionalResourcesLoadChildren = () =>
  import('app/admin/instructional-resource/instructional-resource.module').then(
    module => module.InstructionalResourceModule
  );

export const pipelinesLoadChildren = () =>
  import('app/admin/ingest-pipeline/ingest-pipeline.module').then(
    module => module.IngestPipelineModule
  );

export const sandboxesLoadChildren = () =>
  import('app/admin/sandbox-tenants/sandbox.module').then(
    module => module.SandboxModule
  );

export const tenantsLoadChildren = () =>
  import('app/admin/sandbox-tenants/tenant.module').then(
    module => module.TenantModule
  );

export const adminRoutes: Route[] = [
  {
    path: '',
    children: [
      {
        path: 'aggregate-reports',
        loadChildren: aggregateReportsLoadChildren,
        canActivate: [HasAnyPermissionCanActivate],
        data: {
          breadcrumb: { translate: 'aggregate-reports.heading' },
          permissions: ['CUSTOM_AGGREGATE_READ']
        }
      },
      {
        path: 'embargoes',
        loadChildren: embargoesLoadChildren,
        canActivate: [HasAnyPermissionCanActivate],
        data: {
          breadcrumb: { translate: 'embargo.title' },
          permissions: ['EMBARGO_WRITE']
        }
      },
      {
        path: 'custom-export',
        loadChildren: organizationExportLoadChildren,
        canActivate: [HasAnyPermissionCanActivate],
        data: {
          breadcrumb: { translate: 'organization-export.title' },
          permissions: ['INDIVIDUAL_PII_READ']
        }
      },
      {
        path: 'admin-groups',
        loadChildren: groupsLoadChildren,
        canActivate: [HasAnyPermissionCanActivate],
        data: {
          breadcrumb: {
            translate: 'admin-groups.title'
          },
          permissions: ['GROUP_WRITE']
        }
      },
      {
        path: 'instructional-resource',
        loadChildren: instructionalResourcesLoadChildren,
        canActivate: [HasAnyPermissionCanActivate],
        data: {
          breadcrumb: { translate: 'instructional-resource.title' },
          permissions: ['INSTRUCTIONAL_RESOURCE_WRITE']
        }
      },
      {
        path: 'ingest-pipelines',
        loadChildren: pipelinesLoadChildren,
        canActivate: [HasAnyPermissionCanActivate],
        data: {
          breadcrumb: { translate: 'pipelines.heading' },
          permissions: ['PIPELINE_READ']
        }
      },
      {
        path: 'sandboxes',
        loadChildren: sandboxesLoadChildren,
        canActivate: [HasAnyPermissionCanActivate],
        data: {
          breadcrumb: { translate: 'sandbox-config.title' },
          permissions: ['TENANT_READ']
        }
      },
      {
        path: 'tenants',
        loadChildren: tenantsLoadChildren,
        canActivate: [HasAnyPermissionCanActivate],
        data: {
          breadcrumb: { translate: 'tenant-config.title' },
          permissions: ['TENANT_READ']
        }
      }
    ]
  }
];
