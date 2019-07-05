import { NgModule } from '@angular/core';
import { GroupsComponent } from './groups.component';
import { GroupService } from './groups.service';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';
import { DeleteGroupModalComponent } from './delete-group.modal';
import { DropdownModule } from 'primeng/primeng';
import { ReportingCommonModule } from '../../shared/reporting-common.module';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [GroupsComponent, DeleteGroupModalComponent],
  entryComponents: [DeleteGroupModalComponent],
  imports: [
    CommonModule,
    ReportingCommonModule,
    DropdownModule,
    FormsModule,
    ModalModule,
    TableModule
  ],
  providers: [GroupService]
})
export class GroupsModule {}
