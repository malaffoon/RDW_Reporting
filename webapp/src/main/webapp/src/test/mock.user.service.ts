import { of } from 'rxjs';
import Spy = jasmine.Spy;

export class MockUserService {
  getUser: Spy = jasmine.createSpy('getUser');

  constructor() {
    this.getUser.and.returnValue(
      of({
        firstName: '',
        lastName: '',
        permissions: []
      })
    );
  }
}
