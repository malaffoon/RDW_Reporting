import { Route } from '@angular/router';
import { SandboxesComponent } from './pages/sandboxes/sandboxes.component';
import { NewSandboxConfigurationComponent } from './pages/new-sandbox.component';
import { HasAnyPermissionCanActivate } from '../../shared/security/can-activate/has-any-permission.can-activate';

export const sandboxRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'prefix',
    data: {
      breadcrumb: { translate: 'sandbox-config.title' },
      permissions: ['TENANT_READ']
    },
    canActivate: [HasAnyPermissionCanActivate],
    children: [
      {
        path: '',
        pathMatch: 'prefix',
        component: SandboxesComponent
      },
      {
        path: 'new',
        pathMatch: 'prefix',
        data: {
          breadcrumb: { translate: 'sandbox-config.new-sandbox.header' },
          permissions: ['TENANT_WRITE']
        },
        canActivate: [HasAnyPermissionCanActivate],
        children: [
          {
            path: '',
            pathMatch: 'prefix',
            component: NewSandboxConfigurationComponent
          }
        ]
      }
    ]
  }
];
