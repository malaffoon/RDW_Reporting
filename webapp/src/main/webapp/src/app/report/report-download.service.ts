import { Injectable } from "@angular/core";
import { Http, ResponseContentType, Response, Headers } from "@angular/http";
import { ReportOptions } from "./report-options.model";
import { ReportDownloadToken } from "./report-download-token.model";
import { Observable } from "rxjs";
import { ReportDownload } from "./report-download.model";
import { AssessmentType } from "../shared/enum/assessment-type.enum";
import { AssessmentSubjectType } from "../shared/enum/assessment-subject-type.enum";

@Injectable()
export class ReportDownloadService {

  constructor(private http: Http) {
  }

  public getStudentExamReport(studentId: number, options: ReportOptions): Observable<ReportDownload> {
    return this.getExamReport(`/api/students/${studentId}/examReport`, options);
  }

  public createGroupExamReport(groupId: number, options: ReportOptions): Observable<ReportDownloadToken> {
    return this.createBatchExamReport(`/api/groups/${groupId}/examReports`, options);
  }

  public createSchoolGradeExamReport(schoolId: number, gradeId: number, options: ReportOptions): Observable<ReportDownloadToken> {
    return this.createBatchExamReport(`/api/schools/${schoolId}/assessmentGrades/${gradeId}/examReports`, options);
  }

  public getBatchExamReport(token: ReportDownloadToken): Observable<ReportDownload> {
    return this.getExamReport(`/api/examReports/${token.id}`);
  }

  private createBatchExamReport(url: string, options: ReportOptions): Observable<ReportDownloadToken> {
    return this.http.post(url, { params: this.toParameters(options) })
      .map((response: Response) => response.json())
      .map((token: any) => new ReportDownloadToken(token.id));
  }

  private getExamReport(url: string, options?: ReportOptions): Observable<ReportDownload> {
    return this.http.get(url, {
      params: options != null ? this.toParameters(options) : null,
      headers: new Headers({
        Accept: 'application/pdf'
      }),
      responseType: ResponseContentType.Blob
    }).map((response: Response) => new ReportDownload(
        this.getFileNameFromResponse(response),
        new Blob([ response.blob() ], { type: 'application/pdf' })
      )
    );
  }

  private toParameters(options: ReportOptions): Object {
    return {
      assessmentType: AssessmentType[options.assessmentType],
      subject: AssessmentSubjectType[options.subject],
      schoolYear: options.schoolYear,
      language: options.language,
      grayscale: options.grayscale
    };
  }

  private getFileNameFromResponse(response: Response): string {
    return response.headers.get('Content-Disposition').split(';')[ 1 ].trim().split('=')[ 1 ].replace(/"/g, '');
  }

}
