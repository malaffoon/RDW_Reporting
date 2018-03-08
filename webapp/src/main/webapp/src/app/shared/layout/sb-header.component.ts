import { Component, Input } from "@angular/core";
import { LanguageStore } from "../i18n/language.store";

@Component({
  selector: 'sb-header',
  template: `

  `
})
export class SbHeader {

  @Input()
  homeUrl: string = '/';

  @Input()
  user: any;

  constructor(public languageStore: LanguageStore){
  }

}
