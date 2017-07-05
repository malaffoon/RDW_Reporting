import { NgModule } from "@angular/core";
import { PadStartPipe } from "./pad-start.pipe";
import { SubjectPipe } from "./subject.pipe";
import { SchoolYearPipe } from "./schoolYear.pipe";
import { SearchPipe } from "../search.pipe";
import { HttpModule, Http } from "@angular/http";
import { DataService } from "./data/data.service";
import { CachingDataService } from "./cachingData.service";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { RouterModule } from "@angular/router";
import { RemoveCommaPipe } from "./remove-comma.pipe";
import { SBRadioButtonComponent } from "./sb-radio-button-list.component";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { SBCheckboxList } from "./sb-checkbox-list.component";
import { GradeService } from "./grade.service";
import { GradeDisplayPipe } from "./grade-display.pipe";
import { ScaleScorePipe } from "./scale-score.pipe";
import { AssessmentTypePipe } from "./assessment-type.pipe";

export function createTranslateLoader(http: Http) {
  // return new TranslateHttpLoader(http, '/api/translations/', '');
  // until api implementation is complete, use local .json
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AssessmentTypePipe,
    GradeDisplayPipe,
    PadStartPipe,
    SBRadioButtonComponent,
    SBCheckboxList,
    ScaleScorePipe,
    SchoolYearPipe,
    SearchPipe,
    SubjectPipe,
    RemoveCommaPipe
  ],
  imports: [
    HttpModule,
    FormsModule,
    BrowserModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [ Http ]
      }
    })
  ],
  exports: [
    AssessmentTypePipe,
    GradeDisplayPipe,
    PadStartPipe,
    RemoveCommaPipe,
    RouterModule,
    SBCheckboxList,
    SBRadioButtonComponent,
    ScaleScorePipe,
    SchoolYearPipe,
    SearchPipe,
    SubjectPipe,
    TranslateModule
  ],
  providers: [
    DataService,
    CachingDataService,
    GradeService
  ]
})
export class CommonModule {
}
