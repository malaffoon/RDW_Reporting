import { Route } from '@angular/router';

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
        loadChildren: aggregateReportsLoadChildren
      },
      {
        path: 'embargoes',
        loadChildren: embargoesLoadChildren
      },
      {
        path: 'custom-export',
        loadChildren: organizationExportLoadChildren
      },
      {
        path: 'admin-groups',
        loadChildren: groupsLoadChildren
      },
      {
        path: 'instructional-resource',
        loadChildren: instructionalResourcesLoadChildren
      },
      {
        path: 'ingest-pipelines',
        loadChildren: pipelinesLoadChildren
      },
      {
        path: 'sandboxes',
        loadChildren: sandboxesLoadChildren
      },
      {
        path: 'tenants',
        loadChildren: tenantsLoadChildren
      }
    ]
  }
];
