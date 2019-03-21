import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap';
import { School } from '../../shared/organization/organization';
import { Grade } from '../../school-grade/grade.model';
import { Group } from '../../groups/group';
import {
  PrintableReportFormModalComponent,
  ReportFormModalOptions
} from '../component/printable-report-form-modal/printable-report-form-modal.component';
import {
  createDefaultGroupSchoolGradePrintableReportName,
  createDefaultSchoolGradePrintableReportName,
  createDefaultStudentPrintableReportName
} from '../model/report-forms';
import { Student } from '../../student/model/student.model';
import { SchoolYearPipe } from '../../shared/format/school-year.pipe';

@Injectable()
export class ReportFormService {
  constructor(
    private translate: TranslateService,
    private modalService: BsModalService,
    private schoolYearPipe: SchoolYearPipe
  ) {}

  openStudentPrintableReportForm(
    student: Student,
    schoolYear: number,
    subjectCode: string,
    assessmentTypeCode: string,
    schoolYearOptions: number[]
  ): PrintableReportFormModalComponent {
    const query: any = {
      type: 'Student',
      name: createDefaultStudentPrintableReportName(this.translate, student),
      schoolYear,
      subjectCode,
      assessmentTypeCode,
      studentId: student.id
    };
    return this.openReportForm({
      title: this.translate.instant('student-results.create-report', {
        value: student.firstName != null ? student.firstName : student.ssid
      }),
      query: <any>query,
      fields: {
        schoolYear: {
          options: schoolYearOptions.map(value => ({
            value,
            text: this.schoolYearPipe.transform(value)
          }))
        }
      }
    });
  }

  openSchoolGradePrintableReportForm(
    school: School,
    grade: Grade,
    schoolYear: number
  ): PrintableReportFormModalComponent {
    const query = {
      type: 'SchoolGrade',
      name: createDefaultSchoolGradePrintableReportName(
        this.translate,
        school,
        grade
      ),
      schoolYear,
      schoolId: school.id,
      gradeId: grade.id
    };
    return this.openReportForm({
      title: this.translate.instant(
        'common.reports.form.title.multiple',
        query
      ),
      query: <any>query
    });
  }

  openGroupPrintableReportForm(
    group: Group,
    schoolYear: number
  ): PrintableReportFormModalComponent {
    const query = {
      type: 'Group',
      name: createDefaultGroupSchoolGradePrintableReportName(
        this.translate,
        group
      ),
      schoolYear,
      groupId: {
        id: group.id,
        type: group.userCreated ? 'Teacher' : 'Admin'
      }
    };
    return this.openReportForm({
      title: this.translate.instant(
        'common.reports.form.title.multiple',
        query
      ),
      query: <any>query
    });
  }

  openReportForm(
    options: ReportFormModalOptions
  ): PrintableReportFormModalComponent {
    const modalReference = this.modalService.show(
      PrintableReportFormModalComponent
    );
    const modal: PrintableReportFormModalComponent = modalReference.content;
    modal.options = options;
    return modal;
  }
}
