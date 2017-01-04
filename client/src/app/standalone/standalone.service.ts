import {Injectable} from "@angular/core";
import {Response, ResponseOptions, RequestMethod} from "@angular/http";
import {MockBackend} from "@angular/http/testing";
import {environment} from "../../environments/environment";
import {students} from "./data/students";
import {assessment} from "./data/assessment";

@Injectable()
export class StandaloneService {

  constructor(backend: MockBackend) {
    backend.connections.subscribe(connection => {

      let body: any;

      let requestSignature: string = `${connection.request.method} ${connection.request.url}`;

      if (requestSignature == `${RequestMethod.Get} ${environment.apiURL}/students`) {
        body = students;
      } else if (new RegExp(`${RequestMethod.Get} ${environment.apiURL}/assessments/\\d+`, 'g').test(requestSignature)) {
        body = assessment;
      }

      let requestMethodById = [];
      requestMethodById[RequestMethod.Get] = 'GET';
      requestMethodById[RequestMethod.Post] = 'POST';
      let readableRequestSignature = `${requestMethodById[connection.request.method]} ${connection.request.url}`;

      body
        ? console.debug(`[StandaloneService] serving "${readableRequestSignature}":`, body)
        : console.error(`[StandaloneService] failed to serve: "${readableRequestSignature}"`);

      connection.mockRespond(new Response(new ResponseOptions({body: body})));
    });
  }

}
