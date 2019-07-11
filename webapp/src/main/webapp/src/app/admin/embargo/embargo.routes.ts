import { EmbargoComponent } from './embargo.component';
import { EmbargoResolve } from './embargo.resolve';
import { Route } from '@angular/router';

export const embargoRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'prefix',
    component: EmbargoComponent,
    resolve: { embargoesByOrganizationType: EmbargoResolve }
  }
];
