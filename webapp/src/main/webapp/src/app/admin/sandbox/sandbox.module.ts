import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SandboxConfigurationComponent } from './pages/sandbox.component';
import { SandboxConfigurationDetailsComponent } from './component/sandbox-details.component';
import { ButtonsModule, ModalModule } from 'ngx-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '../../shared/common.module';
import { SandboxService } from './service/sandbox.service';
import { NewSandboxConfigurationComponent } from './pages/new-sandbox.component';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { AccordionModule } from 'primeng/primeng';
import { DeleteSandboxConfigurationModalComponent } from './modal/delete-sandbox.modal';
import { ArchiveSandboxConfigurationModalComponent } from './modal/archive-sandbox.modal';
import { ResetDataModalComponent } from './modal/reset-data.modal';

@NgModule({
  declarations: [
    SandboxConfigurationComponent,
    SandboxConfigurationDetailsComponent,
    NewSandboxConfigurationComponent,
    DeleteSandboxConfigurationModalComponent,
    ArchiveSandboxConfigurationModalComponent,
    ResetDataModalComponent
  ],
  entryComponents: [
    DeleteSandboxConfigurationModalComponent,
    ArchiveSandboxConfigurationModalComponent,
    ResetDataModalComponent
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
