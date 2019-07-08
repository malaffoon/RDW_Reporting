import { EmbargoComponent } from './embargo.component';
import { EmbargoResolve } from './embargo.resolve';
import { Route } from '@angular/router';
import { HasAnyPermissionCanActivate } from '../../shared/security/can-activate/has-any-permission.can-activate';

export const embargoRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'prefix',
    data: {
      breadcrumb: { translate: 'embargo.title' },
      permissions: ['EMBARGO_WRITE']
    },
    canActivate: [HasAnyPermissionCanActivate],
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
