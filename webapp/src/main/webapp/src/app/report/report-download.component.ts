import { OnInit, Input } from "@angular/core";
import { ReportOptions } from "./report-options.model";
import { saveAs } from "file-saver";
import { AssessmentType } from "../shared/enum/assessment-type.enum";
import { AssessmentSubjectType } from "../shared/enum/assessment-subject-type.enum";
import { NotificationService } from "../shared/notification/notification.service";

/**
 * Abstract class used to carry the common logic between all exam report download components
 */
export abstract class ReportDownloadComponent implements OnInit {

  @Input()
  public schoolYears: Array<number>;

  @Input()
  public batch: boolean = false;

  public assessmentTypes: Array<AssessmentType> = [ AssessmentType.IAB, AssessmentType.ICA ];
  public subjectTypes: Array<AssessmentSubjectType> = [ AssessmentSubjectType.MATH, AssessmentSubjectType.ELA ];
  public languages: Array<string> = [ 'eng', 'spa', 'vie' ];
  public options: ReportOptions;

  constructor(private buttonLabel: string, protected notificationService: NotificationService){}

  ngOnInit(): void {
    let defaultOptions: ReportOptions = new ReportOptions();
    defaultOptions.assessmentType = this.batch ? null : this.assessmentTypes[ 0 ];
    defaultOptions.subject = this.batch ? null : this.subjectTypes[ 0 ];
    defaultOptions.schoolYear = this.schoolYears[ 0 ];
    defaultOptions.language = this.languages[ 0 ];
    defaultOptions.grayscale = false;
    this.options = defaultOptions;
  }

  /**
   * Implement this to give behavior to the exam report download form when it is submitted
   */
  public abstract submit(): void;

  /**
   * TODO: remove when feature is ready
   */
  public showComingSoon(): void {
    this.notificationService.info({id: 'labels.reports.messages.coming-soon'});
  }

}
