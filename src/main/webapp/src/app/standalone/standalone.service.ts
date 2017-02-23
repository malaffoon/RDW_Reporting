import {Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod, XHRBackend} from "@angular/http";
import {MockBackend} from "@angular/http/testing";
import {groups} from "./data/groups";
import {group} from "./data/group";
import {exam} from "./data/exam";

export function createStandaloneHttp(mockBackend: MockBackend, options: BaseRequestOptions, realBackend: XHRBackend) {

  mockBackend.connections.subscribe(connection => {

    let body: any = null;
    let requestSignature: string = `${RequestMethod[connection.request.method].toUpperCase()} ${connection.request.url}`;
    if (new RegExp(`${RequestMethod[RequestMethod.Get].toUpperCase()} /api/translations/\\w+`, 'g').test(requestSignature)) {
      connection.request.url = connection.request.url.replace('/api/translations', '/assets/i18n') + '.json';
    } else if (requestSignature == `${RequestMethod[RequestMethod.Get].toUpperCase()} /api/groupSummaries`) {
      body = groups;
    } else if (new RegExp(`${RequestMethod[RequestMethod.Get].toUpperCase()} /api/groups/\\d+/students`, 'g').test(requestSignature)) {
      body = group;
      if (group.students.length < 10) {
        group.students = group.students.concat(group.students);
      }
    } else if (new RegExp(`${RequestMethod[RequestMethod.Get].toUpperCase()} /api/groups/\\d+/students/\\d+/exams`, 'g').test(requestSignature)) {
      body = group;
    } else if (new RegExp(`${RequestMethod[RequestMethod.Get].toUpperCase()} /api/groups/\\d+/students/\\d+/exams/\\d+/items`, 'g').test(requestSignature)) {
      body = group;
    } else if (new RegExp(`${RequestMethod[RequestMethod.Get].toUpperCase()} /api/groups/\\d+/exams`, 'g').test(requestSignature)) {
      body = group;
    } else if (new RegExp(`${RequestMethod[RequestMethod.Get].toUpperCase()} /api/exams/\\d+`, 'g').test(requestSignature)) {
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
