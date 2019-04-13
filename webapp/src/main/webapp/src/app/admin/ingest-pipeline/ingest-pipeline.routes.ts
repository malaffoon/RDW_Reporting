import { AuthorizationCanActivate } from '../../shared/security/authorization.can-activate';
import { ScriptsPageComponent } from './page/scripts/scripts-page.component';
import { ScriptPageComponent } from './page/script/script-page.component';
import { ScriptResolve } from './resolve/script.resolve';

export const ingestPipelineRoutes = [
  {
    path: 'ingest-pipeline',
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
        component: ScriptsPageComponent
      },
      {
        path: ':id',
        component: ScriptPageComponent,
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
