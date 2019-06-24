import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../../service/user.service';

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
