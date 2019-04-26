import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SandboxConfigurationComponent } from './sandbox.component';
import { SandboxConfigurationDetailsComponent } from './sandbox-details.component';
import { ButtonsModule, ModalModule } from 'ngx-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '../../shared/common.module';
import { SandboxService } from './sandbox.service';
import { NewSandboxConfigurationComponent } from './new-sandbox.component';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { AccordionModule } from 'primeng/primeng';

@NgModule({
  declarations: [
    SandboxConfigurationComponent,
    SandboxConfigurationDetailsComponent,
    NewSandboxConfigurationComponent
  ],
  imports: [
    BrowserModule,
    ButtonsModule.forRoot(),
    CommonModule,
    FormsModule,
    MenuModule,
    AccordionModule,
    ReactiveFormsModule,
    HttpClientModule,
    TableModule,
    ModalModule.forRoot()
  ],
  exports: [SandboxConfigurationComponent, NewSandboxConfigurationComponent],
  providers: [SandboxService]
})
export class SandboxModule {}
