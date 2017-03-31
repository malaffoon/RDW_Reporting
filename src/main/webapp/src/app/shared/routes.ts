import {HomeComponent} from "../home/home.component";
import {GroupsComponent} from "../groups/groups.component";
import {GroupStudentsComponent} from "../group-students/group-students.component";
import {StudentExamsComponent} from "../student-exams/student-exams.component";
import {GroupExamsComponent} from "../group-exams/group-exams.component";
import {StudentExamItemsComponent} from "../student-exam-items/student-exam-items.component";
import {GroupExamItemComponent} from "../group-exam-item/group-exam-item.component";
import {StudentExamReportComponent} from "../student-exam-report/student-exam-report.component";
import {AdminSearchComponent} from "../admin-search/admin-search.component";
import {Routes} from "@angular/router";
// import {GroupStudentsResolve} from "../group-students/group-students.resolve";

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'search',
    component: AdminSearchComponent
  },
  {
    path: 'groups',
    component: GroupsComponent
  },
  {
    path: 'groups/:groupId',
    children: [
      { path: '', redirectTo: '/students', pathMatch: 'full' },
      { path: 'students', component: GroupStudentsComponent },
      { path: 'students/:studentId',
        children: [
          { path: 'exams', component: StudentExamsComponent },
          {
            path: 'exams/:examId',
            children: [
              { path: '', redirectTo: 'items', pathMatch: 'full' },
              { path: 'items', component: StudentExamItemsComponent },
              { path: 'report', component: StudentExamReportComponent }
            ]
          }
        ]
      },
      { path: 'exams', component: GroupExamsComponent },
      {
        path: 'exams/:examId',
        children: [
          { path: 'items/:itemId', component: GroupExamItemComponent },
          { path: 'items/:itemId/score/:scoreId', component: GroupExamItemComponent }
        ]
      }
    ]
  }
];
