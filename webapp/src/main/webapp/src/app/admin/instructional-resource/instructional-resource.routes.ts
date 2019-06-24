import { Route } from '@angular/router';
import { InstructionalResourceComponent } from './instructional-resource.component';
import { HasAnyPermissionCanActivate } from '../../shared/security/can-activate/has-any-permission.can-activate';

export const instructionalResourceRoutes: Route[] = [
  {
    path: 'instructional-resource',
    pathMatch: 'prefix',
    data: {
      breadcrumb: { translate: 'instructional-resource.title' },
      permissions: ['INSTRUCTIONAL_RESOURCE_WRITE'],
      denyAccess: true
    },
    canActivate: [HasAnyPermissionCanActivate],
    children: [
      {
        path: '',
        pathMatch: 'prefix',
        component: InstructionalResourceComponent
      }
    ]
  }
];
