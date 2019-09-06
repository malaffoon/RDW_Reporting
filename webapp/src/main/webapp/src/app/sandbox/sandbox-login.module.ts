import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SandboxLoginComponent } from './sandbox-login.component';
import { TranslateModule } from '@ngx-translate/core';
import { SandboxLoginService } from './sandbox-login.service';
import { ReportingCommonModule } from '../shared/reporting-common.module';
import { PopoverModule } from 'ngx-bootstrap';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [SandboxLoginComponent],
  imports: [
    CommonModule,
    ReportingCommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    PopoverModule
  ],
  exports: [SandboxLoginComponent],
  providers: [SandboxLoginService]
})
export class SandboxLoginModule {}
