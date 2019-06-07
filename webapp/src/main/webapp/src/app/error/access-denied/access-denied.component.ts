import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'access-denied',
  templateUrl: './access-denied.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccessDeniedComponent {}
