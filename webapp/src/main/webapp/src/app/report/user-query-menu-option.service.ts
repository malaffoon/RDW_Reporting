import { Injectable } from '@angular/core';
import { UserQueryService } from './user-query.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MenuOption } from '../shared/menu/menu.component';
import { UserQuery } from './report';

function createOptions(
  userQuery: UserQuery,
  userQueryService: UserQueryService,
  translateService: TranslateService,
  router: Router,
  onDeleteQuery: (userQuery: UserQuery) => void
): MenuOption[] {
  return [
    {
      click: createViewQueryOptionHandler(userQuery, router),
      label: translateService.instant('user-query-menu-option.view')
    },
    {
      click: () => onDeleteQuery(userQuery),
      label: translateService.instant('user-query-menu-option.delete')
    }
  ];
}

function createViewQueryOptionHandler(
  userQuery: UserQuery,
  router: Router
): (event: MouseEvent) => void {
  switch (userQuery.query.type) {
    case 'Student':
    case 'SchoolGrade':
    case 'Group':
      return () => console.log('TODO: view query', userQuery.query.type);
    case 'DistrictSchoolExport':
      return () =>
        router.navigateByUrl(`/custom-export?userQueryId=${userQuery.id}`);
    case 'CustomAggregate':
    case 'Longitudinal':
    case 'Claim':
    case 'Target':
      return () =>
        router.navigateByUrl(`/aggregate-reports?userQueryId=${userQuery.id}`);
  }
  return () => {};
}

@Injectable()
export class UserQueryMenuOptionService {
  constructor(
    private router: Router,
    private translateService: TranslateService,
    private userQueryService: UserQueryService
  ) {}

  createMenuOptions(
    userQuery: UserQuery,
    onDeleteQuery: (userQuery: UserQuery) => void
  ): MenuOption[] {
    return createOptions(
      userQuery,
      this.userQueryService,
      this.translateService,
      this.router,
      onDeleteQuery
    );
  }
}
