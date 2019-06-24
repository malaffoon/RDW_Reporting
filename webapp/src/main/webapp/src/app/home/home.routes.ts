import { HomeComponent } from './home.component';
import { Route } from '@angular/router';

export const homeRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent
  }
];
