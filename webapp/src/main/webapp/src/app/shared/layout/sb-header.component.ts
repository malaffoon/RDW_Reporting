import { Component, Input } from "@angular/core";
import { LanguageStore } from "../i18n/language.store";

@Component({
  selector: 'sb-header',
  template: `
    <header>
      <div class="container">
        <div class="well">
          <div class="well-body">
            <nav class="navbar navbar-default">
              <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navigation-bar-collapse" aria-expanded="false">
                  <span class="sr-only">{{'common-ngx.navigation-bar.toggle-sr' | translate}}</span>
                  <span class="icon-bar"></span>
                  <span class="icon-bar"></span>
                  <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand hidden-xs" href="{{homeUrl}}" title="{{'common-ngx.navigation-bar.logo.title' | translate}}"><img src="assets/image/SmarterBalanced-Logo.png" alt="{{'common-ngx.navigation-bar.logo.alt' | translate}}"></a>
                <span class="application-title">{{'common-ngx.navigation-bar.title' | translate}}</span>
              </div>
              <div class="collapse navbar-collapse" id="navigation-bar-collapse">
                <ul class="nav navbar-nav navbar-right">

                  <ng-content></ng-content>

                  <li class="navbar-link">
                    <div class="btn-group" dropdown>
                      <button type="button" dropdownToggle class="btn btn-link dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fa fa-user-circle"></i> <span *ngIf="user">{{'common-ngx.navigation-bar.user-dropdown' | translate:user }}</span> <span class="caret"></span>
                      </button>
                      <ul *dropdownMenu class="dropdown-menu mt-md" role="menu">
                        <li role="menuitem">
                          <a class="dropdown-item" href="javascript:void(0)" onclick="window.document.logoutForm.submit()">{{'common-ngx.navigation-bar.logout' | translate}}</a>
                          <form name="logoutForm" method="post" action="/saml/logout" class="hidden"></form>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li *ngIf="languageStore.availableLanguages.length > 1">
                    <div>
                      <language-select></language-select>
                    </div>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
    <sb-breadcrumbs></sb-breadcrumbs>
  `
})
export class SbHeader {

  @Input()
  homeUrl: string = '/';

  @Input()
  user: any = {};

  constructor(public languageStore: LanguageStore){
  }

}
