import { Route } from '@angular/router';
import { TestResultsComponent } from './test-results.component';

export const testResultsRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'prefix',
    component: TestResultsComponent
  }
];
