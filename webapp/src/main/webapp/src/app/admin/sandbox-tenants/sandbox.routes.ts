import { Route } from '@angular/router';
import { HasAnyPermissionCanActivate } from '../../shared/security/can-activate/has-any-permission.can-activate';
import { TenantsComponent } from './pages/tenants/tenants.component';
import { TenantComponent } from './pages/tenant/tenant.component';
import { tenantBreadcrumb } from './tenant.routes';

export const sandboxRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: TenantsComponent
  },
  {
    path: 'new',
    data: {
      breadcrumb: { translate: 'sandbox-config.new-sandbox.header' },
      permissions: ['TENANT_WRITE'],
      mode: 'create'
    },
    canActivate: [HasAnyPermissionCanActivate],
    component: TenantComponent
  },
  {
    path: ':id',
    component: TenantComponent,
    data: {
      breadcrumb: tenantBreadcrumb,
      mode: 'update'
    }
  }
];
