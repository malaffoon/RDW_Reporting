import { HomeComponent } from "./home/home.component";
import { Routes } from "@angular/router";
import { AuthorizeCanActivate } from "./user/authorize.can-activate";
import { UserResolve } from "./user/user.resolve";

export const routes: Routes = [
  {
    path: '',
    resolve: { user: UserResolve },
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: HomeComponent
      }
    ]
  }
];
