import { Component, Input, OnInit } from '@angular/core';
import { Exam } from '../../../model/exam.model';
import { TranslateService } from '@ngx-translate/core';
import { MenuActionBuilder } from '../../../menu/menu-action.builder';
import { Assessment } from '../../../model/assessment.model';
import { InstructionalResourcesService } from '../../instructional-resources.service';
import { InstructionalResource } from '../../../model/instructional-resources.model';
import { Observable } from 'rxjs';
import { PopupMenuAction } from '../../../../shared/menu/popup-menu-action.model';
import { Ordering } from '@kourge/ordering';
import { OrderingService } from '../../../../shared/ordering/ordering.service';
import { first, map } from 'rxjs/internal/operators';
import { ReportFormService } from '../../../../report/service/report-form.service';
import { createDefaultStudentPrintableReportName } from '../../../../report/model/report-forms';
import { Router } from '@angular/router';

@Component({
  selector: 'results-by-student',
  templateUrl: './results-by-student.component.html'
})
export class ResultsByStudentComponent implements OnInit {
  /**
   * The exams to display
   */
  @Input()
  exams: Exam[];

  /**
   * The assessment
   */
  @Input()
  assessment: Assessment;

  /**
   * Represents the cutoff year for when there is no item level response data available.
   * If there are no exams that are after this school year, then disable the ability to go there and show proper message
   */
  @Input()
  minimumItemDataYear: number;

  @Input()
  showClaimScores: boolean;

  columns: Column[];
  actions: PopupMenuAction[];
  instructionalResourcesProvider: () => Observable<InstructionalResource[]>;
  hasTransferStudent: boolean = false;

  constructor(
    private actionBuilder: MenuActionBuilder,
    private translate: TranslateService,
    private router: Router,
    private instructionalResourcesService: InstructionalResourcesService,
    private orderingService: OrderingService,
    private reportFormService: ReportFormService
  ) {}

  ngOnInit() {
    this.orderingService
      .getScorableClaimOrdering(this.assessment.subject, this.assessment.type)
      .subscribe(ordering => {
        this.columns = [
          new Column({ id: 'name', field: 'student.lastName' }),
          new Column({ id: 'date' }),
          new Column({ id: 'session' }),
          new Column({ id: 'grade', field: 'enrolledGrade', overall: true }),
          new Column({ id: 'school', field: 'school.name' }),
          new Column({ id: 'status', headerInfo: true, overall: true }),
          new Column({ id: 'level', overall: true }),
          new Column({ id: 'score', headerInfo: true, overall: true }),
          ...this.createClaimColumns(ordering)
        ];
        this.actions = this.createActions();
        this.hasTransferStudent = this.exams.some(x => x.transfer);
      });
  }

  loadInstructionalResources(exam: Exam): void {
    this.instructionalResourcesProvider = () =>
      this.instructionalResourcesService
        .getInstructionalResources(this.assessment.id, exam.school.id)
        .pipe(
          map(resources => resources.getResourcesByPerformance(exam.level))
        );
  }

  private createClaimColumns(ordering: Ordering<string>): Column[] {
    if (!this.assessment.claimCodes) {
      return [];
    }

    return this.assessment.claimCodes
      .map(
        (code, index) =>
          new Column({
            id: 'claim',
            field: `claimScores.${index}.level`,
            index: index,
            claim: code
          })
      )
      .sort(ordering.on((column: Column) => column.claim).compare);
  }

  private createActions(): PopupMenuAction[] {
    const builder = this.actionBuilder.newActions();

    if (this.assessment.isInterim) {
      builder.withResponses(
        exam => exam.id,
        exam => exam.student,
        exam => exam.schoolYear > this.minimumItemDataYear
      );
    }

    return builder
      .withStudentHistory(exam => exam.student)
      .withStudentReport(
        () => this.assessment.type,
        exam => exam.student,
        exam => {
          const {
            type: assessmentTypeCode,
            subject: subjectCode
          } = this.assessment;
          const { student, schoolYear } = exam;

          const modal = this.reportFormService.openReportForm({
            title: this.translate.instant(
              'results-by-student.create-single-prepopulated-report',
              {
                name: student.firstName || student.ssid,
                schoolYear: schoolYear,
                subject: this.translate.instant(`subject.${subjectCode}.name`),
                assessmentType: this.translate.instant(
                  `common.assessment-type.${assessmentTypeCode}.short-name`
                )
              }
            ),
            query: <any>{
              type: 'Student',
              name: createDefaultStudentPrintableReportName(
                this.translate,
                student
              ),
              studentId: student.id,
              assessmentTypeCode,
              subjectCode,
              schoolYear
            },
            readonly: ['assessmentType', 'subject', 'schoolYear']
          });
          modal.userReportCreated.subscribe(() => {
            this.router.navigateByUrl('/reports');
          });
        }
      )
      .build();
  }
}

class Column {
  id: string;
  field: string;
  headerInfo: boolean;
  overall: boolean;

  // Claim properties
  index?: number;
  claim?: string;

  constructor({
    id,
    field = '',
    headerInfo = false,
    overall = false,
    index = -1,
    claim = ''
  }) {
    this.id = id;
    this.field = field ? field : id;
    this.headerInfo = headerInfo;
    this.overall = overall;
    if (index >= 0) {
      this.index = index;
    }
    if (claim) {
      this.claim = claim;
    }
  }
}
