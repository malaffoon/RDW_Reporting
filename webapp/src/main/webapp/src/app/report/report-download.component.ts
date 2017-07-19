import { OnInit } from "@angular/core";
import { ReportOptions } from "./report-options.model";
import { saveAs } from "file-saver";
import { AssessmentType } from "../shared/enum/assessment-type.enum";
import { AssessmentSubjectType } from "../shared/enum/assessment-subject-type.enum";
import { ExamFilterOptionsService } from "../assessments/filters/exam-filters/exam-filter-options.service";
import { ExamFilterOptions } from "../assessments/model/exam-filter-options.model";

/**
 * Abstract class used to carry the common logic between all exam report download components
 */
export abstract class ReportDownloadComponent implements OnInit {

  public assessmentTypes: Array<AssessmentType> = [ AssessmentType.IAB, AssessmentType.ICA ];
  public subjectTypes: Array<AssessmentSubjectType> = [ AssessmentSubjectType.MATH, AssessmentSubjectType.ELA ];
  public schoolYears: Array<number>;
  public languages: Array<string> = [ 'eng', 'spa', 'vie' ];
  public options: ReportOptions;

  constructor(private examFilterOptionsService: ExamFilterOptionsService) {
  }

  ngOnInit(): void {
    this.examFilterOptionsService.getExamFilterOptions()
      .subscribe((options: ExamFilterOptions) => {
        let defaultOptions: ReportOptions = new ReportOptions();
        defaultOptions.assessmentType = this.assessmentTypes[ 0 ];
        defaultOptions.subject = this.subjectTypes[ 0 ];
        defaultOptions.schoolYear = options.schoolYears[ 0 ];
        defaultOptions.language = this.languages[ 0 ];
        defaultOptions.grayscale = false;
        this.schoolYears = options.schoolYears;
        this.options = defaultOptions;
      }, (error: Error) => {
        // TODO: handle error case
      });
  }

  /**
   * Implement this to give behavior to the exam report download form when it is submitted
   */
  public abstract submit(): void;

}
