import { NgModule } from '@angular/core';
import { ReportingCommonModule } from '../shared/reporting-common.module';
import { SchoolGradeModule } from '../school-grade/school-grade.module';
import { GroupsModule } from '../groups/groups.module';
import { StudentModule } from '../student/student.module';
import { BsDropdownModule } from 'ngx-bootstrap';
import { AdminToolsComponent } from './component/admin-tools/admin-tools.component';
import { HomeComponent } from './page/home/home.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    ReportingCommonModule,
    StudentModule,
    SchoolGradeModule,
    GroupsModule,
    BsDropdownModule
  ],
  declarations: [AdminToolsComponent, HomeComponent]
})
export class HomeModule {}
