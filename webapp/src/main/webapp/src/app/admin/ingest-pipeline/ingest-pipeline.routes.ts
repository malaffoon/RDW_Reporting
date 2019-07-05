import { PipelinesComponent } from './page/pipelines/pipelines.component';
import { PipelineComponent } from './page/pipeline/pipeline.component';
import { PipelineResolve } from './resolve/pipeline.resolve';
import { UnsavedChangesGuard } from './guard/unsaved-changes.guard';
import { PipelinePublishingHistoryComponent } from './page/pipeline-publishing-history/pipeline-publishing-history.component';
import { BreadcrumbContext } from '../../shared/layout/sb-breadcrumbs.component';
import { HasAnyPermissionCanActivate } from '../../shared/security/can-activate/has-any-permission.can-activate';

export const pipelineBreadcrumb = ({
  data: { pipeline },
  translateService
}: BreadcrumbContext) =>
  translateService.instant(`ingest-pipeline.${pipeline.code}.name`);

export const ingestPipelineRoutes = [
  {
    path: '',
    // path: 'ingest-pipelines',
    pathMatch: 'prefix',
    data: {
      breadcrumb: { translate: 'pipelines.heading' },
      permissions: ['PIPELINE_READ'],
      denyAccess: true
    },
    canActivate: [HasAnyPermissionCanActivate],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: PipelinesComponent
      },
      {
        path: ':id',
        data: {
          breadcrumb: pipelineBreadcrumb
        },
        resolve: {
          pipeline: PipelineResolve
        },
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: PipelineComponent,
            canDeactivate: [UnsavedChangesGuard]
          },
          {
            path: 'history',
            component: PipelinePublishingHistoryComponent,
            data: {
              breadcrumb: {
                translate: 'pipeline-publishing-history.breadcrumb'
              }
            }
          }
        ]
      }
    ]
  }
];
