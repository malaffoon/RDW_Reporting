import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { AlertComponent } from 'ngx-bootstrap';
import { Notification } from './notification';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationComponent {
  @Input()
  notification: Notification;

  @Output()
  onClose: EventEmitter<AlertComponent> = new EventEmitter();
}
