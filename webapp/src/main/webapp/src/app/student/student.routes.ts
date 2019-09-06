import { StudentExamHistoryResolve } from './results/student-exam-history.resolve';
import { StudentResultsComponent } from './results/student-results.component';
import { Route } from '@angular/router';
import { StudentHistoryResponsesAssessmentResolve } from './responses/student-history-responses-assessment.resolve';
import { StudentResponsesResolve } from './responses/student-responses.resolve';
import { StudentHistoryResponsesExamResolve } from './responses/student-history-responses-exam.resolve';
import { StudentHistoryResponsesStudentResolve } from './responses/student-history-responses-student.resolve';
import { StudentResponsesComponent } from './responses/student-responses.component';
import { StudentPipe } from '../shared/format/student.pipe';

export const studentPipe = new StudentPipe();

export const studentTranslateParameters = student => ({
  value: studentPipe.transform(student)
});

export const studentExamHistoryRoutes: Route[] = [
  {
    path: 'exams/:examId',
    pathMatch: 'full',
    resolve: {
      assessment: StudentHistoryResponsesAssessmentResolve,
      assessmentItems: StudentResponsesResolve,
      exam: StudentHistoryResponsesExamResolve,
      student: StudentHistoryResponsesStudentResolve
    },
    data: {
      breadcrumb: {
        translate: 'student-responses.crumb'
      }
    },
    component: StudentResponsesComponent
  }
];

export const studentRoutes: Route[] = [
  {
    path: 'students/:studentId',
    resolve: { examHistory: StudentExamHistoryResolve },
    data: {
      breadcrumb: {
        translate: 'student-results.crumb',
        translateResolve: 'examHistory.student',
        translateParameters: studentTranslateParameters
      }
    },
    children: [
      {
        path: '',
        data: { canReuse: true },
        pathMatch: 'full',
        component: StudentResultsComponent
      },
      ...studentExamHistoryRoutes
    ]
  }
];
