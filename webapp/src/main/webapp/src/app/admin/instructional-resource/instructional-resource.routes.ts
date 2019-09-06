import { Route } from '@angular/router';
import { InstructionalResourceComponent } from './instructional-resource.component';

export const instructionalResourceRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'prefix',
    component: InstructionalResourceComponent
  }
];
