import { NgModule } from '@angular/core';
import { AlertModule } from 'ngx-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserModule } from '@angular/platform-browser';
import { NotificationComponent } from './notification.component';
import { NotificationsComponent } from './notifications.component';

@NgModule({
  imports: [BrowserModule, TranslateModule, AlertModule],
  declarations: [NotificationComponent, NotificationsComponent],
  exports: [NotificationsComponent]
})
export class RdwNotificationsModule {}
