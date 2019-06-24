import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SecurityService } from '../../service/security.service';

@Component({
  selector: 'session-expired',
  templateUrl: './session-expired.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionExpiredComponent {
  constructor(private service: SecurityService) {}

  /**
   * On OK, navigate the browser to their previous route with a full browser refresh.
   * If a previous route is not available, navigate the user to the home page.
   */
  onOk(): void {
    this.service.refreshSession();
  }
}
