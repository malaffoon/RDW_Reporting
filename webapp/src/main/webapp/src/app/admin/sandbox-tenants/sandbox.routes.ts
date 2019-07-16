import { Route } from '@angular/router';
import { SandboxesComponent } from './pages/sandboxes/sandboxes.component';
import { NewSandboxConfigurationComponent } from './pages/new-sandbox.component';
import { HasAnyPermissionCanActivate } from '../../shared/security/can-activate/has-any-permission.can-activate';

export const sandboxRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: SandboxesComponent
  },
  {
    path: 'new',
    data: {
      breadcrumb: { translate: 'sandbox-config.new-sandbox.header' },
      permissions: ['TENANT_WRITE']
    },
    canActivate: [HasAnyPermissionCanActivate],
    component: NewSandboxConfigurationComponent
  }
];
