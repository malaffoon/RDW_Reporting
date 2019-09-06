import { CurrentSchoolResolve } from './results/current-school.resolve';
import { SchoolAssessmentResolve } from './results/school-assessments.resolve';
import { SchoolResultsComponent } from './results/school-results.component';
import { studentRoutes } from '../student/student.routes';
import { Route } from '@angular/router';
import { HasAnyPermissionCanActivate } from '../shared/security/can-activate/has-any-permission.can-activate';

export const schoolGradeRoutes: Route[] = [
  {
    path: 'schools/:schoolId',
    data: {
      breadcrumb: { resolve: 'school.name' },
      permissions: ['INDIVIDUAL_PII_READ']
    },
    resolve: { school: CurrentSchoolResolve },
    canActivate: [HasAnyPermissionCanActivate],
    children: [
      {
        path: '',
        pathMatch: 'full',
        data: { canReuse: true },
        resolve: {
          assessment: SchoolAssessmentResolve,
          school: CurrentSchoolResolve
        },
        component: SchoolResultsComponent
      },
      ...studentRoutes
    ]
  }
];
