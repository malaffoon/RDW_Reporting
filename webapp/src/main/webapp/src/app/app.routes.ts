import { Route, Routes } from '@angular/router';
import { TranslateResolve } from './translate.resolve';
import { SandboxLoginComponent } from './sandbox/sandbox-login.component';
import { userGroupRoutes } from './user-group/user-group.routes';
import { reportRoutes } from './report/report.routes';
import { adminRoutes } from './admin/admin.routes';
import { studentRoutes } from './student/student.routes';
import { groupRoutes } from './groups/group.routes';
import { schoolGradeRoutes } from './school-grade/school-grade.routes';
import { homeRoutes } from './home/home.routes';
import { HasOneOrMorePermissionCanActivate } from './shared/security/can-activate/has-one-or-more-permission.can-activate';
import { ErrorComponent } from './shared/component/error/error.component';
import { AccessDeniedComponent } from './shared/security/component/access-denied/access-denied.component';
import { SessionExpiredComponent } from './shared/security/component/session-expired/session-expired.component';

/**
 * Routes accessible without permissions
 */
export const publicRoutes: Route[] = [
  {
    path: 'error',
    component: ErrorComponent,
    resolve: {
      translateComplete: TranslateResolve
    }
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent,
    resolve: {
      translateComplete: TranslateResolve
    }
  },
  {
    path: 'session-expired',
    component: SessionExpiredComponent,
    resolve: {
      translateComplete: TranslateResolve
    }
  },
  {
    path: 'sandbox-login',
    component: SandboxLoginComponent,
    resolve: {
      translateComplete: TranslateResolve
    }
  }
];

/**
 * Routes requiring permissions to access
 */
export const protectedRoutes: Route[] = [
  {
    path: 'home',
    pathMatch: 'full',
    redirectTo: ''
  },
  {
    path: '',
    resolve: {
      translateComplete: TranslateResolve
    },
    canActivate: [HasOneOrMorePermissionCanActivate],
    children: [
      ...homeRoutes,
      ...adminRoutes,
      ...groupRoutes,
      ...reportRoutes,
      ...schoolGradeRoutes,
      ...studentRoutes,
      ...userGroupRoutes
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

export const routes: Routes = [...publicRoutes, ...protectedRoutes];
