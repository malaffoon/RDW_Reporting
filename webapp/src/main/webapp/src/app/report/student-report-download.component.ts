import { Component, Input } from "@angular/core";
import { ReportService } from "./report.service";
import { saveAs } from "file-saver";
import { ReportDownloadComponent } from "./report-download.component";
import { NotificationService } from "../shared/notification/notification.service";
import { Student } from "../student/model/student.model";
import { Report } from "./report.model";
import { Observable } from "rxjs";

/**
 * Component used for single-student exam report download
 */
@Component({
  selector: 'student-report-download,[student-report-download]',
  templateUrl: './report-download.component.html'
})
export class StudentReportDownloadComponent extends ReportDownloadComponent {

  @Input()
  student: Student;

  constructor(notificationService: NotificationService,
              private service: ReportService) {
    super(notificationService);
    this.displayOrder = false;
  }

  createReport(): Observable<Report> {
    return this.service.createStudentExamReport(this.student, this.options);
  }

}
