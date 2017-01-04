/* tslint:disable:no-unused-variable */
import {TestBed, inject} from "@angular/core/testing";
import {StandaloneService} from "./standalone.service";
import {Http, BaseRequestOptions} from "@angular/http";
import {MockBackend} from "@angular/http/testing";

describe('StandaloneService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          deps: [MockBackend, BaseRequestOptions],
          useFactory: (backend, options) => {
            return new Http(backend, options);
          }
        },
        StandaloneService
      ]
    });
  });

  it('should ...', inject([StandaloneService], (service: StandaloneService) => {
    expect(service).toBeTruthy();
  }));
});
