import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserService } from '../../shared/security/user.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'access-denied',
  templateUrl: './access-denied.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccessDeniedComponent {
  logoutUrl$: Observable<string>;

  constructor(private userService: UserService) {
    this.logoutUrl$ = userService
      .getUser()
      .pipe(map(({ logoutUrl }) => logoutUrl));
  }
}
