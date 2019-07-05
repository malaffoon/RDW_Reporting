import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RdwI18nModule } from '../i18n/rdw-i18n.module';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap';
import { SbBreadcrumbs } from './sb-breadcrumbs.component';
import { SbFooter } from './sb-footer.component';
import { PageHeading } from './page-heading.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [SbBreadcrumbs, SbFooter, PageHeading],
  imports: [
    CommonModule,
    FormsModule,
    RdwI18nModule,
    RouterModule,
    TranslateModule,
    BsDropdownModule
  ],
  exports: [SbBreadcrumbs, SbFooter, PageHeading]
})
export class RdwLayoutModule {}
