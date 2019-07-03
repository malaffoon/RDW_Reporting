import { Route } from '@angular/router';

export const homeLoadChildren = () =>
  import('./module/home/home.module').then(x => x.HomeModule);

export const routes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: 'home',
    loadChildren: homeLoadChildren
  }
];
