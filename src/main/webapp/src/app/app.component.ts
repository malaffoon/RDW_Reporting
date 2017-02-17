import {Component, Optional} from "@angular/core";
import {TranslateService} from 'ng2-translate';

@Component({
  selector: 'app-component',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.less']
})
export class AppComponent {

  constructor(private translate: TranslateService) {

    let languages = ['en', 'ja'];
    let defaultLanguage = languages[0];
    translate.addLangs(languages);
    translate.setDefaultLang(defaultLanguage);
    translate.use(languages.indexOf(translate.getBrowserLang()) != -1 ? translate.getBrowserLang() : defaultLanguage);

  }
}
