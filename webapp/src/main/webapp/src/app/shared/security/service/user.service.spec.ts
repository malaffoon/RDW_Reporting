import { UserService } from './user.service';
import { TestBed, inject } from '@angular/core/testing';
import { of } from 'rxjs';
import { CachingDataService } from '../../data/caching-data.service';

let userStub: any = {
  firstName: 'Bob',
  lastName: 'Mack',
  permissions: ['ALL_STATES_READ'],
  anonymous: false,
  tenant: {
    sandbox: false,
    logoutUrl: '/logout',
    sessionRefreshUrl: '/refresh'
  }
};
let mockDataService = {
  get: () => of(userStub)
};

describe('UserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: CachingDataService, useValue: mockDataService }
      ]
    });
  });

  it('should create a user service.', inject([UserService], userService => {
    expect(userService).toBeDefined();
  }));

  it('should get user info.', inject([UserService], userService => {
    userService.getUser().subscribe(actual => {
      expect(actual.firstName).toBe(userStub.firstName);
      expect(actual.lastName).toBe(userStub.lastName);
      expect(actual.permissions.length).toBe(userStub.permissions.length);
      expect(actual).toEqual({
        firstName: userStub.firstName,
        lastName: userStub.lastName,
        permissions: userStub.permissions,
        logoutUrl: userStub.tenant.logoutUrl,
        sessionRefreshUrl: userStub.tenant.sessionRefreshUrl,
        anonymous: false,
        sandboxUser: false
      });
    });
  }));
});
