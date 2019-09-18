import { TranslateResolve } from '../translate.resolve';
import { SandboxLoginComponent } from './component/sandbox-login-form/sandbox-login.component';

export const sandboxLoginRoutes = [
  {
    path: 'sandbox-login',
    component: SandboxLoginComponent,
    resolve: {
      translateComplete: TranslateResolve
    }
  }
];
