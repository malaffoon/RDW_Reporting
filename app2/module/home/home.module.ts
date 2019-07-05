import { NgModule } from '@angular/core';
import { HomeComponent } from './page/home/home.component';
import { RouterModule } from '@angular/router';
import { homeRoutes } from './home.routes';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule, TranslateModule, RouterModule.forChild(homeRoutes)],
  declarations: [HomeComponent],
  exports: []
})
export class HomeModule {}
