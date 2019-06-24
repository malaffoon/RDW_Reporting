import { AuthorizationCanActivate } from '../../shared/security/authorization.can-activate';
import { EmbargoComponent } from './embargo.component';
import { EmbargoResolve } from './embargo.resolve';
import { Route } from '@angular/router';

export const embargoRoutes: Route[] = [
  {
    path: 'embargoes',
    pathMatch: 'prefix',
    data: {
      breadcrumb: { translate: 'embargo.title' },
      permissions: ['EMBARGO_WRITE']
    },
    canActivate: [AuthorizationCanActivate],
    children: [
      {
        path: '',
        pathMatch: 'prefix',
        component: EmbargoComponent,
        resolve: { embargoesByOrganizationType: EmbargoResolve }
      }
    ]
  }
];
