import { Route } from '@angular/router';
import { HasAnyPermissionCanActivate } from '../shared/security/can-activate/has-any-permission.can-activate';

export const aggregateReportBreadcrumb = ({ translateService }) =>
  translateService.instant('aggregate-reports.heading');

export const embargoBreadcrumb = ({ translateService }) =>
  translateService.instant('embargo.title');

export const testResultsBreadcrumb = ({ translateService }) =>
  translateService.instant('test-results.title');

export const organizationExportBreadcrumb = ({ translateService }) =>
  translateService.instant('organization-export.title');

export const groupsBreadcrumb = ({ translateService }) =>
  translateService.instant('admin-groups.title');

export const instructionalResourceBreadcrumb = ({ translateService }) =>
  translateService.instant('instructional-resource.title');

export const pipelinesBreadcrumb = ({ translateService }) =>
  translateService.instant('pipelines.heading');

export const sandboxesBreadcrumb = ({ translateService }) =>
  translateService.instant('tenants.heading.SANDBOX');

export const tenantsBreadcrumb = ({ translateService }) =>
  translateService.instant('tenants.heading.TENANT');

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
          breadcrumb: aggregateReportBreadcrumb,
          permissions: ['CUSTOM_AGGREGATE_READ']
        }
      },
      {
        path: 'embargoes',
        loadChildren: 'app/admin/embargo/embargo.module#EmbargoModule',
        canActivate: [HasAnyPermissionCanActivate],
        data: {
          breadcrumb: embargoBreadcrumb,
          permissions: ['EMBARGO_WRITE']
        }
      },
      {
        path: 'custom-export',
        loadChildren:
          'app/organization-export/organization-export.module#OrganizationExportModule',
        canActivate: [HasAnyPermissionCanActivate],
        data: {
          breadcrumb: organizationExportBreadcrumb,
          permissions: ['INDIVIDUAL_PII_READ']
        }
      },
      {
        path: 'admin-groups',
        loadChildren: 'app/admin/groups/groups.module#GroupsModule',
        canActivate: [HasAnyPermissionCanActivate],
        data: {
          breadcrumb: groupsBreadcrumb,
          permissions: ['GROUP_WRITE']
        }
      },
      {
        path: 'instructional-resource',
        loadChildren:
          'app/admin/instructional-resource/instructional-resource.module#InstructionalResourceModule',
        canActivate: [HasAnyPermissionCanActivate],
        data: {
          breadcrumb: instructionalResourceBreadcrumb,
          permissions: ['INSTRUCTIONAL_RESOURCE_WRITE']
        }
      },
      {
        path: 'ingest-pipelines',
        loadChildren:
          'app/admin/ingest-pipeline/ingest-pipeline.module#IngestPipelineModule',
        canActivate: [HasAnyPermissionCanActivate],
        data: {
          breadcrumb: pipelinesBreadcrumb,
          permissions: ['PIPELINE_READ']
        }
      },
      {
        path: 'sandboxes',
        loadChildren: 'app/admin/tenant/tenant.module#TenantModule',
        canActivate: [HasAnyPermissionCanActivate],
        data: {
          breadcrumb: sandboxesBreadcrumb,
          permissions: ['TENANT_READ'],
          type: 'SANDBOX'
        }
      },
      {
        path: 'tenants',
        loadChildren: 'app/admin/tenant/tenant.module#TenantModule',
        canActivate: [HasAnyPermissionCanActivate],
        data: {
          breadcrumb: tenantsBreadcrumb,
          permissions: ['TENANT_READ'],
          type: 'TENANT'
        }
      },
      {
        path: 'test-results',
        loadChildren:
          'app/admin/test-results/test-results.module#TestResultsModule',
        canActivate: [HasAnyPermissionCanActivate],
        data: {
          breadcrumb: testResultsBreadcrumb,
          permissions: ['EMBARGO_WRITE']
        }
      }
    ]
  }
];
