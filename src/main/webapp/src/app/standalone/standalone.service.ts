import {Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod, XHRBackend} from "@angular/http";
import {MockBackend} from "@angular/http/testing";
import {groups} from "./data/groups";
import {group} from "./data/group";
import {exam} from "./data/exam";

export function createStandaloneHttp(mockBackend: MockBackend, options: BaseRequestOptions, realBackend: XHRBackend) {

  mockBackend.connections.subscribe(connection => {

    let body: any = null;
    let requestSignature: string = `${RequestMethod[connection.request.method].toUpperCase()} ${connection.request.url}`;
    if (new RegExp(`GET /api/translations/\\w+`, 'g').test(requestSignature)) {
      connection.request.url = connection.request.url.replace('/api/translations', '/assets/i18n') + '.json';
    } else if (requestSignature == `GET /api/groupSummaries`) {
      body = groups;
    } else if (new RegExp(`GET /api/groups/\\d+/students`, 'g').test(requestSignature)) {
      body = group;
    } else if (new RegExp(`GET /api/groups/\\d+/students/\\d+/exams`, 'g').test(requestSignature)) {
      body = group;
    } else if (new RegExp(`GET /api/groups/\\d+/students/\\d+/exams/\\d+/items`, 'g').test(requestSignature)) {
      body = group;
    } else if (new RegExp(`GET /api/groups/\\d+/exams`, 'g').test(requestSignature)) {
      body = group;
    } else if (new RegExp(`GET /api/exams/\\d+`, 'g').test(requestSignature)) {
      body = exam;
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

export const standaloneProviders = [
  MockBackend,
  BaseRequestOptions,
  {
    provide: Http,
    deps: [MockBackend, BaseRequestOptions, XHRBackend],
    useFactory: createStandaloneHttp
  }
];
