import { HomeComponent } from "./home/home.component";
import { Routes } from "@angular/router";
import { GroupResultsComponent } from "./groups/results/group-results.component";
import { GroupAssessmentsResolve } from "./groups/results/group-assessments.resolve";
import { AuthorizeCanActivate } from "./user/authorize.can-activate";
import { UserResolve } from "./user/user.resolve";
import { SchoolAssessmentResolve } from "./school-grade/results/school-assessments.resolve";
import { SchoolResultsComponent } from "./school-grade/results/school-results.component";

export const routes: Routes = [
  {
    path: '',
    resolve: { user: UserResolve },
    children: [
      { path: '', pathMatch: 'full', component: HomeComponent },
      {
        path: 'groups/:groupId',
        pathMatch: 'full',
        resolve: { assessment: GroupAssessmentsResolve },
        data: { breadcrumb: { translate: 'labels.groups.name'}, permissions: ['GROUP_PII_READ'] },
        component: GroupResultsComponent,
        canActivate: [ AuthorizeCanActivate ]
      },
      {
        path: 'schools/:schoolId',
        pathMatch: 'full',
        resolve: { assessment: SchoolAssessmentResolve },
        data: { breadcrumb: { translate: 'labels.schools.name'}, permissions: ['INDIVIDUAL_PII_READ'] },
        component: SchoolResultsComponent,
        canActivate: [ AuthorizeCanActivate ]
      }
    ]
  }
];
