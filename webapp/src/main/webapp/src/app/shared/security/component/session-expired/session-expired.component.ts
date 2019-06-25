import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SecurityService } from '../../service/security.service';
import { UserService } from '../../service/user.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

type Context = 'refresh' | 'reload';

@Component({
  selector: 'session-expired',
  templateUrl: './session-expired.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionExpiredComponent {
  context$: Observable<Context>;

  constructor(
    private userService: UserService,
    private securityService: SecurityService
  ) {
    this.context$ = userService
      .getUser()
      .pipe(
        map(({ sessionRefreshUrl }) =>
          sessionRefreshUrl != null ? 'refresh' : 'reload'
        )
      );
  }

  /**
   * On OK, navigate the browser to their previous route with a full browser refresh.
   * If a previous route is not available, navigate the user to the home page.
   */
  onOk(): void {
    this.securityService.refreshSession();
  }
}
