import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'primeng/components/common/shared';
import { Angulartics2Module } from 'angulartics2';
import { ReportingCommonModule } from '../shared/reporting-common.module';
import { OrganizationExportComponent } from './organization-export.component';
import { OrganizationTreeComponent } from './organization/organization-tree.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { translateModuleConfiguration } from '../shared/translate-module-configuration';
import { RouterModule } from '@angular/router';
import { organizationExportRoutes } from './organization-export.routes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ReportingCommonModule,
    SharedModule,
    Angulartics2Module,
    TranslateModule.forChild(translateModuleConfiguration),
    RouterModule.forChild(organizationExportRoutes)
  ],
  declarations: [OrganizationExportComponent, OrganizationTreeComponent]
})
export class OrganizationExportModule {}
