import { NgModule } from '@angular/core';
import { GroupsComponent } from './groups.component';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';
import { DeleteGroupModalComponent } from './delete-group.modal';
import { DropdownModule } from 'primeng/primeng';
import { ReportingCommonModule } from '../../shared/reporting-common.module';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { translateModuleConfiguration } from '../../shared/translate-module-configuration';
import { RouterModule } from '@angular/router';
import { groupRoutes } from './groups.routes';
import { GroupImportModule } from './import/group-import.module';
import { FileFormatModule } from './import/fileformat/file-format.module';

@NgModule({
  imports: [
    CommonModule,
    ReportingCommonModule,
    DropdownModule,
    FormsModule,
    ModalModule.forRoot(), // this is needed in lazy modules for some reason
    TableModule,
    GroupImportModule,
    FileFormatModule,
    TranslateModule.forChild(translateModuleConfiguration),
    RouterModule.forChild(groupRoutes)
  ],
  declarations: [GroupsComponent, DeleteGroupModalComponent],
  entryComponents: [DeleteGroupModalComponent]
})
export class GroupsModule {}
