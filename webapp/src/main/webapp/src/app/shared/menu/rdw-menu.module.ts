import { NgModule } from '@angular/core';
import { RdwI18nModule } from '../i18n/rdw-i18n.module';
import { PopoverModule } from 'ngx-bootstrap';
import { PopupMenuComponent } from './popup-menu.component';
import { TranslateModule } from '@ngx-translate/core';
import { MenuComponent } from './menu.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [MenuComponent, PopupMenuComponent],
  imports: [CommonModule, PopoverModule, RdwI18nModule, TranslateModule],
  exports: [MenuComponent, PopupMenuComponent]
})
export class RdwMenuModule {}
