import { GroupsComponent } from './groups.component';
import { GroupImportComponent } from './import/group-import.component';
import { GroupImportDeactivateGuard } from './import/group-import.deactivate';
import { FileFormatComponent } from './import/fileformat/file-format.component';
import { ImportHistoryComponent } from './import/history/import-history.component';
import { ImportHistoryResolve } from './import/history/import-history.resolve';
import { Route } from '@angular/router';

export const groupRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'prefix',
    component: GroupsComponent
  },
  {
    path: 'import',
    data: {
      breadcrumb: { translate: 'group-import.title' }
    },
    children: [
      {
        path: '',
        pathMatch: 'prefix',
        component: GroupImportComponent,
        canDeactivate: [GroupImportDeactivateGuard]
      },
      {
        path: 'fileformat',
        pathMatch: 'prefix',
        data: {
          breadcrumb: { translate: 'file-format.header' }
        },
        children: [
          {
            path: '',
            pathMatch: 'prefix',
            component: FileFormatComponent
          }
        ]
      }
    ]
  },
  {
    path: 'history',
    pathMatch: 'prefix',
    children: [
      {
        path: '',
        pathMatch: 'prefix',
        component: ImportHistoryComponent,
        resolve: { imports: ImportHistoryResolve },
        data: { breadcrumb: { translate: 'import-history.title' } }
      }
    ]
  }
];
