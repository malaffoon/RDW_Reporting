import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { AdminDropdownComponent } from './admin-dropdown.component';
import { BrowserModule } from '@angular/platform-browser';
import { TabsModule } from 'ngx-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '../shared/common.module';
import { UserGroupModule } from '../user-group/user-group.module';
import { SchoolGradeModule } from '../school-grade/school-grade.module';
import { GroupsModule } from '../groups/groups.module';
import { StudentModule } from '../student/student.module';

@NgModule({
  declarations: [
    HomeComponent,
    AdminDropdownComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    StudentModule,
    SchoolGradeModule,
    GroupsModule,
    UserGroupModule,
    TabsModule.forRoot()
  ],
  exports: [
    HomeComponent
  ]
})
export class HomeModule {

}
