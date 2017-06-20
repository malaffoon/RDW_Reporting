import { HomeComponent } from "./home/home.component";
import { Routes } from "@angular/router";
import { GroupResultsComponent } from "./groups/results/group-results.component";
import { GroupsResolve } from "./groups/groups.resolve";
import { AssessmentsResolve } from "./groups/results/assessments.resolve";
import { AuthorizeCanActivate } from "./user/authorize.can-activate";

export const routes: Routes = [
  {
    path: '',
    resolve: { groups: GroupsResolve },
    children: [
      { path: '', pathMatch: 'full', component: HomeComponent },
      {
        path: 'groups/:groupId',
        pathMatch: 'full',
        resolve: { assessment: AssessmentsResolve },
        data: { breadcrumb: { translate: 'labels.groups.name'}, permissions: ['GROUP_PII_READ','INDIVIDUAL_PII_READ'] },
        component: GroupResultsComponent,
        canActivate: [ AuthorizeCanActivate ]
      }
    ]
  }
];
