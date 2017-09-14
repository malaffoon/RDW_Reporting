import { OnInit, Input, ViewChild, Output, EventEmitter } from "@angular/core";
import { ReportOptions } from "./report-options.model";
import { AssessmentType } from "../shared/enum/assessment-type.enum";
import { AssessmentSubjectType } from "../shared/enum/assessment-subject-type.enum";
import { NotificationService } from "../shared/notification/notification.service";
import { ReportOrder } from "./report-order.enum";
import { PopoverDirective } from "ngx-bootstrap";
import { Observable } from "rxjs";
import { Report } from "./report.model";

/**
 * Abstract class used to carry the common logic between all exam report download components
 */
export abstract class ReportDownloadComponent implements OnInit {

  @ViewChild('downloadPopover')
  protected popover: PopoverDirective;

  @Input()
  schoolYear: number;

  @Input()
  displayOrder: boolean = true;

  @Input()
  subject: string;

  @Output()
  onShown: EventEmitter<any> = new EventEmitter<any>();

  onShownInternal(event: any) {
    this.onShown.emit(event);
  }

  assessmentTypes: AssessmentType[] = [ null, AssessmentType.IAB, AssessmentType.ICA ];
  subjectTypes: AssessmentSubjectType[] = [ null, AssessmentSubjectType.MATH, AssessmentSubjectType.ELA ];
  languages: string[] = [ 'eng', 'spa', 'vie' ];
  orders: ReportOrder[] = [ ReportOrder.STUDENT_NAME, ReportOrder.STUDENT_SSID ];
  options: ReportOptions;

  constructor(private buttonLabel: string, protected notificationService: NotificationService) {
  }

  ngOnInit(): void {
    let defaultOptions: ReportOptions = new ReportOptions();
    defaultOptions.assessmentType = this.assessmentTypes[ 0 ];
    defaultOptions.subject = this.subject != null ? this.getSubjectFromString(this.subject) : this.subjectTypes[ 0 ];
    defaultOptions.schoolYear = this.schoolYear;
    defaultOptions.language = this.languages[ 0 ];
    defaultOptions.order = this.orders[ 0 ];
    defaultOptions.grayscale = false;
    this.options = defaultOptions;
  }

  submit(): void {
    this.popover.hide();
    this.createReport()
      .subscribe(
        () => {
          this.notificationService.info({ id: 'labels.reports.messages.submitted.html', html: true });
        },
        () => {
          this.notificationService.error({ id: 'labels.reports.messages.submission-failed.html', html: true });
        }
      );
  }

  /**
   * Implement this to give behavior to the exam report download form when it is submitted
   */
  abstract createReport(): Observable<Report>;

  /**
   * Converts the given string to an AssessmentSubjectType
   *
   * @param value the AssessmentSubjectType name
   * @returns the AssessmentSubjectType for the given string assessment type name
   */
  private getSubjectFromString(value: string): AssessmentSubjectType {
    return value === '' ? null : AssessmentSubjectType[value];
  }

}
