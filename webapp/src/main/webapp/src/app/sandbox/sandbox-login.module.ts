import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SandboxLoginComponent } from './sandbox-login.component';
import { TranslateModule } from '@ngx-translate/core';
import { SandboxLoginService } from './sandbox-login.service';
import { CommonModule } from '../shared/common.module';
import { PopoverModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [SandboxLoginComponent],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    PopoverModule
  ],
  exports: [SandboxLoginComponent],
  providers: [SandboxLoginService]
})
export class SandboxLoginModule {}
