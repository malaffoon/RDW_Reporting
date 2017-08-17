import { Routes } from "@angular/router";
import { UserResolve } from "./user/user.resolve";
import { GroupsComponent } from "./groups/groups.component";
import { GroupFilterOptionsResolve } from "./groups/group-filter-options.resolve";
import { AuthorizeCanActivate } from "./user/authorize.can-activate";
import { GroupImportComponent } from "./groups/import/group-import.component";

export const routes: Routes = [
  {
    path: '',
    resolve: { user: UserResolve, filterOptions: GroupFilterOptionsResolve },
    data: { permissions: [ 'GROUP_WRITE' ] },
    canActivate: [ AuthorizeCanActivate ],
    children: [
      {
        path: '',
        pathMatch: 'prefix',
        redirectTo: 'groups'
      }, {
        path: 'groups',
        pathMatch: 'prefix',
        data: { breadcrumb: { translate: 'labels.groups.title' } },
        children: [ {
          path: '',
          pathMatch: 'prefix',
          component: GroupsComponent,
        }, {
          path: 'import',
          pathMatch: 'prefix',
          children: [ {
            path: '',
            pathMatch: 'prefix',
            component: GroupImportComponent,
            data: { breadcrumb: { translate: 'labels.import.title' } },
          } ]
        } ]
      }
    ]
  }
];
