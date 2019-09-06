import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ReportingCommonModule } from '../shared/reporting-common.module';
import { PopoverModule } from 'ngx-bootstrap';
import { CommonModule } from '@angular/common';
import { SandboxLoginComponent } from './component/sandbox-login-form/sandbox-login.component';

@NgModule({
  imports: [
    CommonModule,
    ReportingCommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    PopoverModule
  ],
  declarations: [SandboxLoginComponent]
})
export class SandboxLoginModule {}
