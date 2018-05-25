import { NgModule } from '@angular/core';
import { UserGroupsComponent } from './user-groups.component';
import { UserGroupService } from './user-group.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '../shared/common.module';
import { PopoverModule } from 'ngx-bootstrap';
import { UserGroupsTableComponent } from './user-groups-table.component';
import { UserGroupResolve } from './user-group.resolve';
import { UserGroupComponent } from './user-group.component';
import { UserGroupOptionsService } from './user-group-options.service';

@NgModule({
  declarations: [
    UserGroupComponent,
    UserGroupsComponent,
    UserGroupsTableComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PopoverModule.forRoot(),
    TableModule
  ],
  exports: [
    UserGroupComponent
  ],
  providers: [
    UserGroupService,
    UserGroupOptionsService,
    UserGroupResolve
  ]
})
export class UserGroupModule {

}
