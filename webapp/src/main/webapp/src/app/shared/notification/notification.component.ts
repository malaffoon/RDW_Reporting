import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { AlertComponent } from 'ngx-bootstrap';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationComponent {
  @Input()
  notification: Notification;

  @Output()
  onClose: EventEmitter<AlertComponent> = new EventEmitter();
}
