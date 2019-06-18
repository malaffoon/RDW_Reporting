import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SandboxesComponent } from './pages/sandboxes/sandboxes.component';
import {
  BsDropdownModule,
  ButtonsModule,
  ModalModule,
  PopoverModule
} from 'ngx-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '../../shared/common.module';
import { NewSandboxConfigurationComponent } from './pages/new-sandbox.component';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { AccordionModule, TreeTableModule } from 'primeng/primeng';
import { DeleteSandboxConfigurationModalComponent } from './modal/delete-sandbox.modal';
import { DeleteTenantConfigurationModalComponent } from './modal/delete-tenant.modal';
import { PropertyOverrideTableComponent } from './component/property-override-table.component';
import { NewTenantConfigurationComponent } from './pages/new-tenant.component';
import { TenantsComponent } from './pages/tenants/tenants.component';
import { PropertyOverrideTreeTableComponent } from './component/property-override-tree-table.component';
import { WellGroupListComponent } from './component/well-group-list/well-group-list.component';
import { TenantSandboxComponent } from './component/tenant-sandbox/tenant-sandbox.component';

@NgModule({
  declarations: [
    DeleteSandboxConfigurationModalComponent,
    DeleteTenantConfigurationModalComponent,
    NewSandboxConfigurationComponent,
    NewTenantConfigurationComponent,
    PropertyOverrideTableComponent,
    PropertyOverrideTreeTableComponent,
    SandboxesComponent,
    TenantsComponent,
    TenantSandboxComponent,
    WellGroupListComponent
  ],
  entryComponents: [
    DeleteSandboxConfigurationModalComponent,
    DeleteTenantConfigurationModalComponent
  ],
  imports: [
    AccordionModule,
    BrowserModule,
    BsDropdownModule.forRoot(),
    ButtonsModule.forRoot(),
    CommonModule,
    FormsModule,
    HttpClientModule,
    MenuModule,
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    ReactiveFormsModule,
    TableModule,
    TreeTableModule
  ]
})
export class TenantModule {}
