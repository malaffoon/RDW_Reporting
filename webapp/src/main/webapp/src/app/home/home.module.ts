import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '../shared/common.module';
import { SchoolGradeModule } from '../school-grade/school-grade.module';
import { GroupsModule } from '../groups/groups.module';
import { StudentModule } from '../student/student.module';
import { BsDropdownModule } from 'ngx-bootstrap';
import { AdminToolsComponent } from './admin-tools.component';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    StudentModule,
    SchoolGradeModule,
    GroupsModule,
    BsDropdownModule.forRoot()
  ],
  declarations: [AdminToolsComponent, HomeComponent]
})
export class HomeModule {}
