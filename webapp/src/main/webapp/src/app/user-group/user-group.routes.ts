import { UserGroupComponent } from './user-group.component';
import { UserGroupResolve } from './user-group.resolve';
import { HasAnyPermissionCanActivate } from '../shared/security/can-activate/has-any-permission.can-activate';

export const userGroupRoutes = [
  {
    path: 'user-groups',
    data: {
      permissions: ['TEACHER_GROUP_READ']
    },
    canActivate: [HasAnyPermissionCanActivate],
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
