import { aggregateReportRoutes } from '../aggregate-report/aggregate-report.routes';
import { embargoRoutes } from './embargo/embargo.routes';
import { groupRoutes as groupAdminRoutes } from './groups/groups.routes';
import { instructionalResourceRoutes } from './instructional-resource/instructional-resource.routes';
import { organizationExportRoutes } from '../organization-export/organization-export.routes';
import { Route } from '@angular/router';

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
      ...aggregateReportRoutes,
      ...embargoRoutes,
      ...groupAdminRoutes,
      ...instructionalResourceRoutes,
      ...organizationExportRoutes,
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
