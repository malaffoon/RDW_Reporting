import { Injectable } from "@angular/core";
import { ResponseContentType, Headers } from "@angular/http";
import { ReportOptions } from "./report-options.model";
import { Observable } from "rxjs";
import { AssessmentType } from "../shared/enum/assessment-type.enum";
import { AssessmentSubjectType } from "../shared/enum/assessment-subject-type.enum";
import { DataService } from "../shared/data/data.service";
import { Download } from "../shared/data/download.model";
import { Report } from "./report.model";

@Injectable()
export class ReportService {

  constructor(private dataService: DataService) {
  }

  /**
   * TODO: hook up to API
   *
   * Gets a list of all reports for the logged in user
   *
   * @returns {Observable<Report[]>}
   */
  public getReports(): Observable<Report[]> {

    let report1 = new Report();
    report1.id = 1;
    report1.label = 'Report 1';
    report1.created = new Date(2017, 1, 1);
    report1.status = 'COMPLETED';

    let report2 = new Report();
    report2.id = 2;
    report2.label = 'Report 2';
    report2.created = new Date(2017, 1, 2);
    report2.status = 'FAILED';

    let report3 = new Report();
    report3.id = 3;
    report3.label = 'Report 3';
    report3.created = new Date(2017, 1, 3);
    report3.status = 'EXPIRED';

    return Observable.of([report1, report2, report3]);
  }

  /**
   * Gets a student exam report PDF download
   *
   * @param studentId the student ID
   * @param options settings which to shape the report content
   * @returns {Observable<Download>}
   */
  public getStudentExamReport(studentId: number, options: ReportOptions): Observable<Download> {
    return this.getExamReport(`/students/${studentId}/examReport`, options);
  }

  /**
   * Creates a group exam report PDF for download
   *
   * @param groupId the group ID
   * @param options settings which to shape the report content
   * @returns {Observable<Report>} the handle used the get status on the download
   */
  public createGroupExamReport(groupId: number, options: ReportOptions): Observable<Report> {
    return this.createBatchExamReport(`/groups/${groupId}/examReports`, options);
  }

  /**
   * Creates a school/grade exam report PDF for download
   *
   * @param schoolId the school ID
   * @param gradeId the assessment grade ID
   * @param options settings which to shape the report content
   * @returns {Observable<Report>} the handle used the get status on the download
   */
  public createSchoolGradeExamReport(schoolId: number, gradeId: number, options: ReportOptions): Observable<Report> {
    return this.createBatchExamReport(`/schools/${schoolId}/assessmentGrades/${gradeId}/examReports`, options);
  }

  /**
   * Gets an exam report download if ready, otherwise throws an exception
   *
   * @param reportId the handle used to lookup the download
   * @returns {Observable<Download>}
   */
  public getBatchExamReport(reportId: number): Observable<Download> {
    return this.getExamReport(`/examReports/${reportId}`);
  }

  /**
   * Creates a batch exam report download
   *
   * @param url the endpoint to use to create the report
   * @param options settings which to shape the report content
   * @returns {Observable<Report>}
   */
  private createBatchExamReport(url: string, options: ReportOptions): Observable<Report> {
    return this.dataService.post(url, { params: this.toParameters(options) })
      .map(this.toReport);
  }

  /**
   * Gets an exam report PDF and wraps it in a ReportDownload
   *
   * @param url the location of the exam report PDF download
   * @param options settings which to shape the report content
   * @returns {Observable<Download>}
   */
  private getExamReport(url: string, options?: ReportOptions): Observable<Download> {
    return this.dataService.get(url, {
      params: options != null ? this.toParameters(options) : null,
      headers: new Headers({
        Accept: 'application/pdf'
      }),
      responseType: ResponseContentType.Blob
    });
  }

  /**
   * Gets the URL parameters for the given report options
   *
   * @param options the options to convert to url parameters
   * @returns {{assessmentType: any, subject: any, schoolYear: number, language: string, grayscale: boolean}}
   */
  private toParameters(options: ReportOptions): Object {
    return {
      assessmentType: AssessmentType[ options.assessmentType ],
      subject: AssessmentSubjectType[ options.subject ],
      schoolYear: options.schoolYear,
      language: options.language,
      grayscale: options.grayscale
    };
  }

  /**
   * Maps a API report model to a local report model
   *
   * @param remote the API model
   * @returns {Report} the local model
   */
  private toReport(remote: any): Report {
    let local: Report = new Report();
    local.id = remote.id;
    local.label = remote.label;
    local.status = remote.status;
    local.created = remote.created;
    return local;
  }

}
