import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from '../app';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpModule,
    ReactiveFormsModule,
    TranslateModule.forRoot(),
    RouterModule.forRoot(routes)
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
