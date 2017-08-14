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
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: HomeComponent
      }, {
        path: 'groups',
        resolve: { filterOptions: GroupFilterOptionsResolve },
        data: { permissions: [ 'GROUP_READ' ]},
        canActivate: [ AuthorizeCanActivate ],
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
