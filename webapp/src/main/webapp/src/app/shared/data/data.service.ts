import { Injectable } from "@angular/core";
import { Http, RequestOptionsArgs, Response, ResponseContentType } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import { Download } from "./download.model";

//TODO: Break out methods from DataService so only a public generic Get.
//TODO: Other methods such as getGroups belong in their own service such as GroupService
@Injectable()
export class DataService {

  constructor(private http: Http) {
  }

  public get(url: string, options?: RequestOptionsArgs): Observable<any> {
    return this.http
      .get(`/api${url}`, options)
      .map(this.getMapper(options));
  }

  public post(url: string, options?: RequestOptionsArgs): Observable<any> {
    return this.http
      .post(`/api${url}`, options)
      .map(this.getMapper(options));
  }

  // TODO: move to group service
  public getGroups(): Observable<Array<any>> {
    return this.get(`/groups`);
  }

  private getMapper(options?: RequestOptionsArgs): (response: Response) => any {
    if (options != null && options.responseType == ResponseContentType.Blob) {
      return (response: Response) => new Download(
        this.getFileNameFromResponse(response),
        new Blob([ response.blob() ], { type: this.getContentType(response) })
      );
    }
    return response => response.json();
  }

  /**
   * Gets the file name specified in the Content-Disposition HTTP response header
   *
   * @param response the HTTP response
   * @returns {string} the file name
   */
  private getFileNameFromResponse(response: Response): string {
    return response.headers.get('Content-Disposition').split(';')[ 1 ].trim().split('=')[ 1 ].replace(/"/g, '');
  }

  /**
   * Gets the content type of an HTTP response from the Content-Type HTTP response header
   *
   * @param response the HTTP response
   * @returns {string} the content type
   */
  private getContentType(response: Response): string {
    return response.headers.get('Content-Type').trim();
  }

}
