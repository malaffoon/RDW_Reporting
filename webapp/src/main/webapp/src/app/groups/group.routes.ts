import { Route } from '@angular/router';
import { AuthorizationCanActivate } from '../shared/security/authorization.can-activate';
import { GroupAssessmentResolve } from './results/group-assessment.resolve';
import { GroupResultsComponent } from './results/group-results.component';
import { studentRoutes } from '../student/student.routes';
import { GroupDashboardComponent } from '../dashboard/group-dashboard/group-dashboard.component';

export const groupRoutes: Route[] = [
  {
    path: 'group-exams',
    data: {
      breadcrumb: { translate: 'groups.heading' },
      permissions: ['GROUP_PII_READ']
    },
    canActivate: [AuthorizationCanActivate],
    children: [
      {
        path: '',
        pathMatch: 'full',
        data: { canReuse: true },
        resolve: { assessment: GroupAssessmentResolve },
        component: GroupResultsComponent
      },
      ...studentRoutes
    ]
  },
  {
    path: 'group-dashboard',
    data: {
      breadcrumb: { translate: 'group-dashboard.name' },
      permissions: ['GROUP_PII_READ']
    },
    canActivate: [AuthorizationCanActivate],
    children: [
      {
        path: '',
        pathMatch: 'full',
        data: { canReuse: true },
        component: GroupDashboardComponent
      }
    ]
  }
];
