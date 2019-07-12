import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ReportingCommonModule } from '../shared/reporting-common.module';
import { ModalModule, PopoverModule } from 'ngx-bootstrap';
import { UserGroupResolve } from './user-group.resolve';
import { UserGroupComponent } from './user-group.component';
import { StudentSearchModule } from '../student/search/student-search.module';
import { UserGroupFormComponent } from './user-group-form.component';
import { UserGroupsComponent } from './user-groups.component';
import { UserGroupTableComponent } from './user-group-table.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    UserGroupComponent,
    UserGroupFormComponent,
    UserGroupsComponent,
    UserGroupTableComponent
  ],
  imports: [
    CommonModule,
    ReportingCommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    PopoverModule,
    StudentSearchModule,
    TableModule
  ],
  providers: [UserGroupResolve],
  exports: [UserGroupsComponent]
})
export class UserGroupModule {}
