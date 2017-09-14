import { NgModule } from "@angular/core";
import { CommonModule } from "../shared/common.module";
import { UserService } from "./user.service";
import { AuthorizeDirective } from "./authorize.directive";
import { UserMapper } from "./user.mapper";
import { BrowserModule } from "@angular/platform-browser";
import { AuthorizeCanActivate } from "./authorize.can-activate";
import { UserResolve } from "./user.resolve";
import { AuthorizeAtleastOneCanActivate } from "./authorize-at-least-one.can-activate";

@NgModule({
  declarations: [ AuthorizeDirective ],
  imports: [ CommonModule, BrowserModule ],
  exports: [ AuthorizeDirective ],
  providers: [ UserMapper, UserService, AuthorizeCanActivate, AuthorizeAtleastOneCanActivate, UserResolve ]
})
export class UserModule {
}
