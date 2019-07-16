import { NgModule } from '@angular/core';
import { DeleteTenantConfigurationModalComponent } from './modal/delete-tenant.modal';
import { NewTenantConfigurationComponent } from './pages/new-tenant.component';
import { TenantsComponent } from './pages/tenants/tenants.component';
import { SandboxTenantSharedModule } from './sandbox-tenant-shared.module';
import { RouterModule } from '@angular/router';
import { tenantRoutes } from './tenant.routes';
import { TranslateModule } from '@ngx-translate/core';
import { translateModuleConfiguration } from '../../shared/translate-module-configuration';
import { CommonModule } from '@angular/common';
import {
  BsDropdownModule,
  ButtonsModule,
  ModalModule,
  PopoverModule
} from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportingCommonModule } from '../../shared/reporting-common.module';
import { AccordionModule, MenuModule, TreeTableModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { TenantComponent } from './pages/tenant/tenant.component';

/**
 * TODO join this with tenant.module and make the route structure this:
 *
 * tenants?sandbox=true|false to choose what tenants to display at any given time
 */
@NgModule({
  imports: [
    CommonModule,
    BsDropdownModule,
    FormsModule,
    ReactiveFormsModule,
    ReportingCommonModule,
    AccordionModule,
    ButtonsModule,
    MenuModule,
    ModalModule.forRoot(), // this is needed in lazy modules for some reason
    PopoverModule,
    TableModule,
    TreeTableModule,
    SandboxTenantSharedModule,
    TranslateModule.forChild(translateModuleConfiguration),
    RouterModule.forChild(tenantRoutes)
  ],
  declarations: [
    DeleteTenantConfigurationModalComponent,
    NewTenantConfigurationComponent,
    TenantsComponent,
    TenantComponent
  ],
  entryComponents: [DeleteTenantConfigurationModalComponent]
})
export class TenantModule {}
