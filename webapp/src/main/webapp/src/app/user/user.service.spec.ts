import { UserService } from "./user.service";
import { CachingDataService } from "../shared/cachingData.service";
import { TestBed, inject } from "@angular/core/testing";
import { UserMapper } from "./user.mapper";
import { RequestOptionsArgs } from "@angular/http";
import { Observable } from "rxjs";


let mockUser: any = {};
let ds = {
  get(url: string, options?: RequestOptionsArgs): Observable<any> {
    return Observable.of(mockUser);
  }
};

describe('UserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [],
      providers: [ UserService, UserMapper, { provide: CachingDataService, useValue: ds } ]
    });
  });

  it('should create a user service.',
    inject([ UserService ], (userService) => {
      expect(userService).toBeDefined();
    }));

  it('should get user info.',
    inject([ UserService ], (userService) => {
      mockUser = { firstName: "Bob", lastName: "Mack", permissions: [ "ALL_STATES_READ" ] };

      userService.getCurrentUser().subscribe(actual => {
        expect(actual.firstName).toBe(mockUser.firstName);
        expect(actual.lastName).toBe(mockUser.lastName);
        expect(actual.permissions.length).toBe(mockUser.permissions.length);
      })
    }));

  it('should return current user has permission if collections are the same.',
    inject([ UserService ], (userService) => {
      mockUser = { permissions: [ "ALL_STATES_READ" ] };
      let permissions = [ "ALL_STATES_READ" ];

      userService.doesCurrentUserHaveAtLeastOnePermission(permissions).subscribe(actual => {
        expect(actual).toBe(true);
      })

    }));

  it('should return current user has permission if cases are different',
    inject([ UserService ], (userService) => {
      mockUser = { permissions: [ "ALL_STATES_READ" ] };
      let permissions = [ "all_states_read" ];

      userService.doesCurrentUserHaveAtLeastOnePermission(permissions).subscribe(actual => {
        expect(actual).toBe(true);
      })
    }));

  it('should return current user has permission even if user missing some of the permissions checked.',
    inject([ UserService ], (userService) => {
      mockUser = { permissions: [ "ALL_STATES_READ" ] };
      let permissions = [ "INDIVIDUAL_PII_READ", "GROUP_PII_READ", "POPULATION_AGGREGATE_READ", "ALL_STATES_READ" ];

      userService.doesCurrentUserHaveAtLeastOnePermission(permissions).subscribe(actual => {
        expect(actual).toBe(true);
      })
    }));

  it('should return current user has permission if they have more permissions than being hcecked.',
    inject([ UserService ], (userService) => {
      mockUser = { permissions: [ "INDIVIDUAL_PII_READ", "GROUP_PII_READ", "POPULATION_AGGREGATE_READ", "ALL_STATES_READ" ] };
      let permissions = [ "ALL_STATES_READ" ];

      userService.doesCurrentUserHaveAtLeastOnePermission(permissions).subscribe(actual => {
        expect(actual).toBe(true);
      })
    }));

  it('should return current user does not have permission if they are missing a permission being checked.',
    inject([ UserService ], (userService) => {
      mockUser = { permissions: [ "INDIVIDUAL_PII_READ", "GROUP_PII_READ", "ALL_STATES_READ", "POPULATION_AGGREGATE_READ" ] };
      let permissions = [ "SRS_EXTRACTS_READ" ];

      userService.doesCurrentUserHaveAtLeastOnePermission(permissions).subscribe(actual => {
        expect(actual).toBe(false);
      })
    }));

  it('should return current user does not have permission if they are missing all permission being checked.',
    inject([ UserService ], (userService) => {
      mockUser = { permissions: [ "ALL_STATES_READ", "INDIVIDUAL_PII_READ", "GROUP_PII_READ", "POPULATION_AGGREGATE_READ" ] };
      let permissions = [ "SRS_EXTRACTS_READ", "IIRD_EXTRACTS_READ", "AUDIT_XML_READ" ];

      userService.doesCurrentUserHaveAtLeastOnePermission(permissions).subscribe(actual => {
        expect(actual).toBe(false);
      })
    }));
});
