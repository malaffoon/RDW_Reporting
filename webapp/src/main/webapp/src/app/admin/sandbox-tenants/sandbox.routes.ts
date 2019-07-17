import { Route } from '@angular/router';
import { NewSandboxConfigurationComponent } from './pages/new-sandbox.component';
import { HasAnyPermissionCanActivate } from '../../shared/security/can-activate/has-any-permission.can-activate';
import { TenantsComponent } from './pages/tenants/tenants.component';
import { TenantComponent } from './pages/tenant/tenant.component';
import { tenantBreadcrumb } from './tenant.routes';

export const sandboxRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: TenantsComponent,
    data: {
      type: 'SANDBOX'
    }
  },
  {
    path: 'new',
    data: {
      breadcrumb: { translate: 'sandbox-config.new-sandbox.header' },
      permissions: ['TENANT_WRITE']
    },
    canActivate: [HasAnyPermissionCanActivate],
    component: NewSandboxConfigurationComponent
  },
  {
    path: ':id',
    component: TenantComponent,
    data: {
      breadcrumb: tenantBreadcrumb
    }
  }
];
