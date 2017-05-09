import {Component} from "@angular/core";
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-component',
  templateUrl: './app.component.html'
})
export class AppComponent {

  private user;

  constructor(private translate: TranslateService) {

    let languages = ['en', 'ja'];
    let defaultLanguage = languages[0];
    translate.addLangs(languages);
    translate.setDefaultLang(defaultLanguage);
    translate.use(languages.indexOf(translate.getBrowserLang()) != -1 ? translate.getBrowserLang() : defaultLanguage);

  }

  ngOnInit() {
    this.user = {
      firstName: 'Terry',
      lastName: 'McManus'
    };
  }
}
