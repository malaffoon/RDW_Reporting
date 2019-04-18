import { AuthorizationCanActivate } from '../../shared/security/authorization.can-activate';
import { ScriptsComponent } from './page/scripts/scripts.component';
import { ScriptComponent } from './page/script/script.component';
import { ScriptResolve } from './resolve/script.resolve';
import { PipelinesComponent } from './page/pipelines/pipelines.component';
import { PipelineComponent } from './page/pipeline/pipeline.component';
import { PipelineResolve } from './resolve/pipeline.resolve';

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
        component: PipelineComponent,
        data: {
          breadcrumb: { resolve: 'pipeline.name' }
        },
        resolve: {
          pipeline: PipelineResolve
        }
      }
      // {
      //   path: '',
      //   pathMatch: 'full',
      //   component: ScriptsComponent
      // },
      // {
      //   path: ':id',
      //   component: PipelineComponent,
      //   data: {
      //     breadcrumb: { resolve: 'script.name' }
      //   },
      //   resolve: {
      //     script: ScriptResolve
      //   }
      // }
    ]
  }
];
