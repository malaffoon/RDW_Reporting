import {HomeComponent} from "../home/home.component";
import {StudentsComponent} from "../students/students.component";
import {StudentExamsComponent} from "../student-exams/student-exams.component";
import {GroupExamsComponent} from "../group-exams/group-exams.component";

export const routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'groups/:groupId/students',
    component: StudentsComponent
  },
  {
    path: 'groups/:groupId/students/:studentId/exams',
    component: StudentExamsComponent
  },
  {
    path: 'groups/:groupId/exams',
    component: GroupExamsComponent
  }
];
