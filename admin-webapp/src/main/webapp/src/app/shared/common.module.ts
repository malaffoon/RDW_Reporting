import { NgModule } from "@angular/core";
import { SubjectPipe } from "./subject.pipe";
import { HttpModule, Http } from "@angular/http";
import { DataService } from "./data/data.service";
import { CachingDataService } from "./data/caching-data.service";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { Angulartics2Module } from 'angulartics2';
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { DataTableRowExpanderComponent } from "./datatable/datatable-row-expander.component";
import { RdwFormatModule } from "@sbac/rdw-reporting-common-ngx";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    DataTableRowExpanderComponent,
    SubjectPipe
  ],
  imports: [
    HttpModule,
    FormsModule,
    BrowserModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http]
      }
    }),
    Angulartics2Module.forChild()
  ],
  exports: [
    DataTableRowExpanderComponent,
    RouterModule,
    SubjectPipe,
    TranslateModule,
    RdwFormatModule
  ],
  providers: [
    DataService,
    CachingDataService
  ]
})
export class CommonModule {
}
