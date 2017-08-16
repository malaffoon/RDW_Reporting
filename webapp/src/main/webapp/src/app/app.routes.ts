import { HomeComponent } from "./home/home.component";
import { Routes } from "@angular/router";
import { UserResolve } from "./user/user.resolve";
import { GroupsComponent } from "./groups/groups.component";
import { GroupFilterOptionsResolve } from "./groups/group-filter-options.resolve";
import { AuthorizeCanActivate } from "./user/authorize.can-activate";

export const routes: Routes = [
  {
    path: '',
    resolve: { user: UserResolve },
    data: { permissions: [ 'GROUP_WRITE' ]},
    canActivate: [ AuthorizeCanActivate ],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: HomeComponent
      }, {
        path: 'groups',
        resolve: { filterOptions: GroupFilterOptionsResolve },
        children: [ {
          path: 'filterBy',
          pathMatch: 'full',
          data: { breadcrumb: { translate: 'labels.groups.title' } },
          component: GroupsComponent
        } ]
      }
    ]
  }
];
