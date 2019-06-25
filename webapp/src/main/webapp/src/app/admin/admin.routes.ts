import { aggregateReportRoutes } from '../aggregate-report/aggregate-report.routes';
import { embargoRoutes } from './embargo/embargo.routes';
import { groupRoutes as groupAdminRoutes } from './groups/groups.routes';
import { ingestPipelineRoutes } from './ingest-pipeline/ingest-pipeline.routes';
import { instructionalResourceRoutes } from './instructional-resource/instructional-resource.routes';
import { organizationExportRoutes } from '../organization-export/organization-export.routes';
import { tenantRoutes } from './sandbox-tenants/tenant.routes';
import { Route } from '@angular/router';

export const adminRoutes: Route[] = [
  {
    path: '',
    children: [
      ...aggregateReportRoutes,
      ...embargoRoutes,
      ...groupAdminRoutes,
      ...ingestPipelineRoutes,
      ...instructionalResourceRoutes,
      ...organizationExportRoutes,
      ...tenantRoutes
    ]
  }
];
