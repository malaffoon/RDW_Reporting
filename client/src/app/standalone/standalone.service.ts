import {Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod, XHRBackend} from "@angular/http";
import {MockBackend} from "@angular/http/testing";
import {environment} from "../../environments/environment";
import {students} from "./data/students";
import {assessment} from "./data/assessment";

let getRequestSignature = (methodCode, url) => {
  let requestMethodById = [];
  requestMethodById[RequestMethod.Get] = 'GET';
  requestMethodById[RequestMethod.Post] = 'POST';
  return `${requestMethodById[methodCode]} ${url}`;
};

export let standaloneProviders = [
  MockBackend,
  BaseRequestOptions,
  {
    provide: Http,
    deps: [MockBackend, BaseRequestOptions, XHRBackend],
    useFactory: (mockBackend: MockBackend, options: BaseRequestOptions, realBackend: XHRBackend) => {

      mockBackend.connections.subscribe(connection => {

        let body: any = null;
        let requestSignature: string = getRequestSignature(connection.request.method, connection.request.url);
        if (requestSignature == `${getRequestSignature(RequestMethod.Get, environment.apiURL)}/students`) {
          body = students;
        } else if (new RegExp(`${getRequestSignature(RequestMethod.Get, environment.apiURL)}/assessments/\\d+`, 'g').test(requestSignature)) {
          body = assessment;
        }

        if (body != null) {
          console.debug(`[StandaloneService] serving mock for "${requestSignature}":`, body);
          connection.mockRespond(new Response(new ResponseOptions({body: body})));
        } else {
          console.debug(`[StandaloneService] no mock for "${requestSignature}"`);
          let realHttp = new Http(realBackend, options);
          realHttp.get(connection.request.url).subscribe(response => connection.mockRespond(response));
        }

      });

      return new Http(mockBackend, options);
    }
  }
];
