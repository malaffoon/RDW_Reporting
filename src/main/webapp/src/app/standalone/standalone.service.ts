import {Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod, XHRBackend} from "@angular/http";
import {MockBackend} from "@angular/http/testing";
import {groups, mock_item, exams_of_group, mock_student, exams_of_student, iab_items} from "./data/data";
import {group} from "./data/data";
import {exam} from "./data/exam";

export function createStandaloneHttp(mockBackend: MockBackend, options: BaseRequestOptions, realBackend: XHRBackend) {

  mockBackend.connections.subscribe(connection => {

    let body: any = null;
    let requestSignature: string = `${RequestMethod[connection.request.method].toUpperCase()} ${connection.request.url}`;
    if (new RegExp(`GET /api/translations/\\w+`, 'g').test(requestSignature)) {
      connection.request.url = connection.request.url.replace('/api/translations', '/assets/i18n') + '.json';
    } else if (requestSignature == `GET /api/groupSummaries`) {
      body = groups;
    } else if (new RegExp(`GET /api/groups/\\d+/students/\\d+/exams/\\d+`, 'g').test(requestSignature)) {
      body = {
        group: group,
        student: mock_student,
        exam: exams_of_student[0],
        items: iab_items
      };
    } else if (new RegExp(`GET /api/groups/\\d+/students/\\d+/exams`, 'g').test(requestSignature)) {
      body = {
        group: group,
        student: mock_student,
        exams: exams_of_student
      };
    } else if (new RegExp(`GET /api/groups/\\d+/students`, 'g').test(requestSignature)) {
      body = group;
    } else if (new RegExp(`GET /api/groups/\\d+/exams/\\d+/items/\\d+/score/\\d+`, 'g').test(requestSignature)) {
      body = {
        group: group,
        item: mock_item
      };
    } else if (new RegExp(`GET /api/groups/\\d+/exams/\\d+/items/\\d+`, 'g').test(requestSignature)) {
      body = {
        group: group,
        item: mock_item
      };
    } else if (new RegExp(`GET /api/groups/\\d+/exams`, 'g').test(requestSignature)) {
      body = {
        group: group,
        assessment_results: exams_of_group
      };
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
