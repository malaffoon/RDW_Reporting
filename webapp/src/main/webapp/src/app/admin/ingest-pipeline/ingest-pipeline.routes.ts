import { AuthorizationCanActivate } from '../../shared/security/authorization.can-activate';
import { PipelinesComponent } from './page/pipelines/pipelines.component';
import { PipelineComponent } from './page/pipeline/pipeline.component';
import { PipelineResolve } from './resolve/pipeline.resolve';
import { UnsavedChangesGuard } from './guard/unsaved-changes.guard';
import { PipelinePublishingHistoryComponent } from './page/pipeline-publishing-history/pipeline-publishing-history.component';

export const ingestPipelineRoutes = [
  {
    path: 'ingest-pipelines',
    pathMatch: 'prefix',
    data: {
      breadcrumb: { translate: 'pipelines.heading' },
      permissions: ['INDIVIDUAL_PII_READ'], // TODO update this
      denyAccess: true
    },
    canActivate: [AuthorizationCanActivate],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: PipelinesComponent
      },
      {
        path: ':id',
        data: {
          breadcrumb: { resolve: 'pipeline.name' }
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
