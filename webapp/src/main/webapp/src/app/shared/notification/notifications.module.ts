import { NgModule } from '@angular/core';
import { AlertModule } from 'ngx-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationComponent } from './notification.component';
import { NotificationsComponent } from './notifications.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule, TranslateModule, AlertModule],
  declarations: [NotificationComponent, NotificationsComponent],
  exports: [NotificationsComponent]
})
export class RdwNotificationsModule {}
