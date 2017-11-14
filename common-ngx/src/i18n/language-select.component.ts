import { Component } from "@angular/core";
import { LanguageStore } from "./language.store";

@Component({
  selector: 'language-select',
  template: `
    <select class="form-control" [(ngModel)]="languageStore.language">
      <option *ngFor="let language of languageStore.languages" [ngValue]="language">
        {{'common-ngx.languages.' + language | translate}}
      </option>
    </select>
  `
})
export class LanguageSelect {

  constructor(public languageStore: LanguageStore) {
  }

}
