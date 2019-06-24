import { AuthorizationCanActivate } from '../../shared/security/authorization.can-activate';
import { Route } from '@angular/router';
import { InstructionalResourceComponent } from './instructional-resource.component';

export const instructionalResourceRoutes: Route[] = [
  {
    path: 'instructional-resource',
    pathMatch: 'prefix',
    data: {
      breadcrumb: { translate: 'instructional-resource.title' },
      permissions: ['INSTRUCTIONAL_RESOURCE_WRITE'],
      denyAccess: true
    },
    canActivate: [AuthorizationCanActivate],
    children: [
      {
        path: '',
        pathMatch: 'prefix',
        component: InstructionalResourceComponent
      }
    ]
  }
];
