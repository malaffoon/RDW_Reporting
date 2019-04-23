import { AuthorizationCanActivate } from '../../shared/security/authorization.can-activate';
import { PipelinesComponent } from './page/pipelines/pipelines.component';
import { PipelineComponent } from './page/pipeline/pipeline.component';
import { PipelineResolve } from './resolve/pipeline.resolve';
import { PipelineTestsComponent } from './page/pipeline-tests/pipeline-tests.component';

export const ingestPipelineRoutes = [
  {
    path: 'ingest-pipelines',
    pathMatch: 'prefix',
    data: {
      breadcrumb: { translate: 'home.admin-tools.ingest-pipelines.button' },
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
            component: PipelineComponent
          },
          {
            path: 'tests',
            component: PipelineTestsComponent,
            data: {
              breadcrumb: { translate: 'pipeline-tests.heading' }
            }
          }
        ]
      }
    ]
  }
];
