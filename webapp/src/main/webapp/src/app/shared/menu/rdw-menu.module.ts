import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RdwI18nModule } from '../i18n/rdw-i18n.module';
import { PopoverModule } from 'ngx-bootstrap';
import { PopupMenuComponent } from './popup-menu.component';
import { TranslateModule } from '@ngx-translate/core';
import { MenuComponent } from './menu.component';

@NgModule({
  declarations: [MenuComponent, PopupMenuComponent],
  imports: [
    BrowserModule,
    PopoverModule.forRoot(),
    RdwI18nModule,
    TranslateModule.forRoot()
  ],
  exports: [MenuComponent, PopupMenuComponent]
})
export class RdwMenuModule {}
