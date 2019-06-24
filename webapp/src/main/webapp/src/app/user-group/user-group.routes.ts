import { AuthorizationCanActivate } from '../shared/security/authorization.can-activate';
import { UserGroupComponent } from './user-group.component';
import { UserGroupResolve } from './user-group.resolve';

export const userGroupRoutes = [
  {
    path: 'user-groups',
    data: {
      permissions: ['GROUP_PII_READ']
    },
    canActivate: [AuthorizationCanActivate],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: UserGroupComponent,
        data: {
          breadcrumb: { translate: 'user-group.new-heading' }
        },
        resolve: {
          group: UserGroupResolve
        }
      },
      {
        path: ':groupId',
        pathMatch: 'full',
        component: UserGroupComponent,
        data: {
          breadcrumb: { resolve: 'group.name' }
        },
        resolve: {
          group: UserGroupResolve
        }
      }
    ]
  }
];
