import { NgModule } from '@angular/core';
import { UserGroupsComponent } from './user-groups.component';
import { UserGroupService } from './user-group.service';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '../shared/common.module';
import { PopoverModule } from 'ngx-bootstrap';
import { UserGroupsTableComponent } from './user-groups-table.component';
import { DefaultUserGroupResolve, UserGroupResolve } from './user-group.resolve';
import { UserGroupComponent } from './user-group.component';
import { TranslateModule } from '@ngx-translate/core';

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
    PopoverModule.forRoot(),
    TranslateModule.forRoot(),
    TableModule
  ],
  exports: [
    UserGroupComponent
  ],
  providers: [
    UserGroupService,
    UserGroupResolve,
    DefaultUserGroupResolve
  ]
})
export class UserGroupModule {

}
