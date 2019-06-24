import { Route, Routes } from '@angular/router';
import { TranslateResolve } from './translate.resolve';
import { ErrorComponent } from './error/error.component';
import { AccessDeniedComponent } from './error/access-denied/access-denied.component';
import { SessionExpiredComponent } from './shared/security/session-expired.component';
import { RoutingAuthorizationCanActivate } from './shared/security/routing-authorization.can-activate';
import { SandboxLoginComponent } from './sandbox/sandbox-login.component';
import { userGroupRoutes } from './user-group/user-group.routes';
import { reportRoutes } from './report/report.routes';
import { adminRoutes } from './admin/admin.routes';
import { studentRoutes } from './student/student.routes';
import { groupRoutes } from './groups/group.routes';
import { schoolGradeRoutes } from './school-grade/school-grade.routes';
import { homeRoutes } from './home/home.routes';

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
    canActivate: [RoutingAuthorizationCanActivate],
    children: [
      ...homeRoutes,
      ...adminRoutes,
      ...groupRoutes,
      ...reportRoutes,
      ...schoolGradeRoutes,
      ...studentRoutes,
      ...userGroupRoutes
    ]
  }
];

export const routes: Routes = [...publicRoutes, ...protectedRoutes];
