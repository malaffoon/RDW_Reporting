import Spy = jasmine.Spy;
import { Observable } from "rxjs/Observable";

export class MockRouter {

  public navigateByUrl: Spy = jasmine.createSpy("navigateByUrl");
  public navigate: Spy = jasmine.createSpy("navigate");
  public events = Observable.empty();

  constructor() {}
}
