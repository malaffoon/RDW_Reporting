import { Injectable } from '@angular/core';
import { UserQueryService } from './user-query.service';
import { UserQueryStore } from './user-query.store';
import { UserReportService } from './user-report.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MenuOption } from '../shared/menu/menu.component';
import { first } from 'rxjs/operators';
import { UserQuery, UserReport } from './report';

function createOptions(
  userQuery: UserQuery,
  userQueryService: UserQueryService,
  userQueryStore: UserQueryStore,
  translateService: TranslateService,
  router: Router
): MenuOption[] {
  return [
    {
      click: () => console.log('TODO: view query'),
      label: translateService.instant('user-query-menu-option.view')
    },
    {
      click: () =>
        userQueryService.deleteQuery(userQuery.id).subscribe(() => {
          userQueryStore.setState(
            userQueryStore.state.filter(({ id }) => id !== userQuery.id)
          );
        }),
      label: translateService.instant('user-query-menu-option.delete')
    }
  ];
}

@Injectable()
export class UserQueryMenuOptionService {
  constructor(
    private router: Router,
    private translateService: TranslateService,
    private userQueryService: UserQueryService,
    private userQueryStore: UserQueryStore
  ) {}

  createMenuOptions(userQuery: UserQuery): MenuOption[] {
    return createOptions(
      userQuery,
      this.userQueryService,
      this.userQueryStore,
      this.translateService,
      this.router
    );
  }
}
