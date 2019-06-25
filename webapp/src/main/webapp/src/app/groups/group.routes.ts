import { Route } from '@angular/router';
import { GroupAssessmentResolve } from './results/group-assessment.resolve';
import { GroupResultsComponent } from './results/group-results.component';
import { studentRoutes } from '../student/student.routes';
import { GroupDashboardComponent } from '../dashboard/group-dashboard/group-dashboard.component';
import { HasAnyPermissionCanActivate } from '../shared/security/can-activate/has-any-permission.can-activate';

export const groupRoutes: Route[] = [
  {
    path: 'group-exams',
    data: {
      breadcrumb: { translate: 'groups.heading' },
      permissions: ['GROUP_PII_READ']
    },
    canActivate: [HasAnyPermissionCanActivate],
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
    canActivate: [HasAnyPermissionCanActivate],
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
