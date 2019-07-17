import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TenantConfiguration } from '../../model/tenant-configuration';
import { TenantService } from '../../service/tenant.service';
import { SandboxConfiguration } from '../../model/sandbox-configuration';
import { flatMap, map } from 'rxjs/operators';
import { TenantType } from '../../model/tenant-type';

@Component({
  selector: 'tenants',
  templateUrl: './tenants.component.html'
})
export class TenantsComponent {
  tenantType$: Observable<TenantType>;
  tenants$: Observable<TenantConfiguration[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: TenantService
  ) {
    // TODO polling

    this.tenantType$ = this.route.data.pipe(map(({ type }) => type));

    this.tenants$ = this.tenantType$.pipe(
      flatMap(type =>
        this.service
          .getAll(type)
          .pipe(
            map(tenants =>
              tenants.slice().sort((a, b) => a.label.localeCompare(b.label))
            )
          )
      )
    );
  }

  onTenantClick(tenant: SandboxConfiguration): void {
    this.router.navigate(['.', tenant.code], {
      relativeTo: this.route
    });
  }
}
