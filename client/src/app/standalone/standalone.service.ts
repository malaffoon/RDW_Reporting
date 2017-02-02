import {Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod, XHRBackend} from "@angular/http";
import {MockBackend} from "@angular/http/testing";
import {students} from "./data/students";
import {assessment} from "./data/assessment";

export let standaloneProviders = [
  MockBackend,
  BaseRequestOptions,
  {
    provide: Http,
    deps: [MockBackend, BaseRequestOptions, XHRBackend],
    useFactory: (mockBackend: MockBackend, options: BaseRequestOptions, realBackend: XHRBackend) => {

      mockBackend.connections.subscribe(connection => {

        let body: any = null;
        let requestSignature: string = `${RequestMethod[connection.request.method].toUpperCase()} ${connection.request.url}`;
        if (requestSignature == `${RequestMethod[RequestMethod.Get].toUpperCase()} /api/students`) {
          body = students;
        } else if (new RegExp(`${RequestMethod[RequestMethod.Get].toUpperCase()} /api/assessments/\\d+`, 'g').test(requestSignature)) {
          body = assessment;
        }

        if (body != null) {
          console.debug(`[StandaloneService] serving mock for "${requestSignature}":`, body);
          connection.mockRespond(new Response(new ResponseOptions({body: body})));
        } else {
          console.debug(`[StandaloneService] no mock for "${requestSignature}"`);
          let realHttp = new Http(realBackend, options);
          realHttp.request(connection.request).subscribe(response => connection.mockRespond(response));
        }

      });

      return new Http(mockBackend, options);
    }
  }
];
