import { Route } from '@angular/router';
import { HasAnyPermissionCanActivate } from '../shared/security/can-activate/has-any-permission.can-activate';

export const adminRoutes: Route[] = [
  {
    path: '',
    children: [
      {
        path: 'aggregate-reports',
        loadChildren:
          'app/aggregate-report/aggregate-reports.module#AggregateReportsModule',
        canActivate: [HasAnyPermissionCanActivate],
        data: {
          breadcrumb: { translate: 'aggregate-reports.heading' },
          permissions: ['CUSTOM_AGGREGATE_READ']
        }
      },
      {
        path: 'embargoes',
        loadChildren: 'app/admin/embargo/embargo.module#EmbargoModule',
        canActivate: [HasAnyPermissionCanActivate],
        data: {
          breadcrumb: { translate: 'embargo.title' },
          permissions: ['EMBARGO_WRITE']
        }
      },
      {
        path: 'custom-export',
        loadChildren:
          'app/organization-export/organization-export.module#OrganizationExportModule',
        canActivate: [HasAnyPermissionCanActivate],
        data: {
          breadcrumb: { translate: 'organization-export.title' },
          permissions: ['INDIVIDUAL_PII_READ']
        }
      },
      {
        path: 'admin-groups',
        loadChildren: 'app/admin/groups/groups.module#GroupsModule',
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
        loadChildren:
          'app/admin/instructional-resource/instructional-resource.module#InstructionalResourceModule',
        canActivate: [HasAnyPermissionCanActivate],
        data: {
          breadcrumb: { translate: 'instructional-resource.title' },
          permissions: ['INSTRUCTIONAL_RESOURCE_WRITE']
        }
      },
      {
        path: 'ingest-pipelines',
        loadChildren:
          'app/admin/ingest-pipeline/ingest-pipeline.module#IngestPipelineModule',
        canActivate: [HasAnyPermissionCanActivate],
        data: {
          breadcrumb: { translate: 'pipelines.heading' },
          permissions: ['PIPELINE_READ']
        }
      },
      {
        path: 'sandboxes',
        loadChildren: 'app/admin/tenant/tenant.module#TenantModule',
        canActivate: [HasAnyPermissionCanActivate],
        data: {
          breadcrumb: { translate: 'sandbox-config.title' },
          permissions: ['TENANT_READ'],
          type: 'SANDBOX'
        }
      },
      {
        path: 'tenants',
        loadChildren: 'app/admin/tenant/tenant.module#TenantModule',
        canActivate: [HasAnyPermissionCanActivate],
        data: {
          breadcrumb: { translate: 'tenant-config.title' },
          permissions: ['TENANT_READ'],
          type: 'TENANT'
        }
      }
    ]
  }
];
