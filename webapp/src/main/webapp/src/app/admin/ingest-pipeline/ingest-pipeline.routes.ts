import { AuthorizationCanActivate } from '../../shared/security/authorization.can-activate';
import { ScriptsComponent } from './page/scripts/scripts.component';
import { ScriptComponent } from './page/script/script.component';
import { ScriptResolve } from './resolve/script.resolve';
import { PipelinesComponent } from './page/pipelines/pipelines.component';

export const ingestPipelineRoutes = [
  {
    path: 'ingest-pipelines',
    pathMatch: 'prefix',
    data: {
      breadcrumb: { translate: 'home.admin-tools.ingest-pipeline.button' },
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
        path: 'scripts/:id',
        component: ScriptComponent,
        data: {
          breadcrumb: { resolve: 'script.name' }
        },
        resolve: {
          script: ScriptResolve
        }
      }
    ]
  }
];
