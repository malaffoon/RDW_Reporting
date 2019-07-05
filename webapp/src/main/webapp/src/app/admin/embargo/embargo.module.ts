import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmbargoComponent } from './embargo.component';
import { ButtonsModule, ModalModule } from 'ngx-bootstrap';
import { Toggle } from './toggle.component';
import { EmbargoTable } from './embargo-table.component';
import { EmbargoConfirmationModal } from './embargo-confirmation-modal.component';
import { HttpClientModule } from '@angular/common/http';
import { EmbargoResolve } from './embargo.resolve';
import { CommonModule } from '../../shared/common.module';
import { TableModule } from 'primeng/table';

@NgModule({
  imports: [
    BrowserModule,
    ButtonsModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    ModalModule,
    TableModule
  ],
  declarations: [
    EmbargoComponent,
    EmbargoTable,
    Toggle,
    EmbargoConfirmationModal
  ],
  providers: [EmbargoResolve],
  entryComponents: [EmbargoConfirmationModal]
})
export class EmbargoModule {}
