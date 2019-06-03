import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SandboxLoginComponent } from './sandbox-login.component';
import { TranslateModule } from '@ngx-translate/core';
import { SandboxLoginService } from './sandbox-login.service';

@NgModule({
  declarations: [SandboxLoginComponent],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, TranslateModule],
  exports: [SandboxLoginComponent],
  providers: [SandboxLoginService]
})
export class SandboxLoginModule {}
