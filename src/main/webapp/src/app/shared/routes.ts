import {HomeComponent} from "../home/home.component";
import {StudentsComponent} from "../students/students.component";
import {StudentExamsComponent} from "../student-exams/student-exams.component";
import {GroupExamsComponent} from "../group-exams/group-exams.component";
import {StudentExamItemsComponent} from "../student-exam-items/student-exam-items.component";
import {StudentsWithItemScoreComponent} from "../students-with-item-score/students-with-item-score.component";

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
    path: 'groups/:groupId/exams',
    component: GroupExamsComponent
  },
  {
    path: 'groups/:groupId/exams/:examId/items/:itemId/score/:score/students',
    component: StudentsWithItemScoreComponent
  },
  {
    path: 'groups/:groupId/students/:studentId/exams',
    component: StudentExamsComponent
  },
  {
    path: 'groups/:groupId/students/:studentId/exams/:examId/items',
    component: StudentExamItemsComponent
  }
];
