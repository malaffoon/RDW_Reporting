import {GroupsComponent} from "../groups/groups.component";
import {StudentsComponent} from "../students/students.component";
import {ExamsComponent} from "../exams/exams.component";
import {ExamComponent} from "../exam/exam.component";

export const routes = [
  {
    path: '',
    redirectTo: '/groups',
    pathMatch: 'full'
  },
  {
    path: 'groups',
    component: GroupsComponent
  },
  {
    path: 'groups/:groupId/students',
    component: StudentsComponent
  },
  {
    path: 'groups/:groupId/students/:studentId/exams',
    component: ExamsComponent
  },
  {
    path: 'groups/:groupId/exams',
    component: ExamsComponent
  },
  {
    path: 'exams/:examId',
    component: ExamComponent
  }
]
