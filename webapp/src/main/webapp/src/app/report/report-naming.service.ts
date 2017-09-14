import { Student } from "../student/model/student.model";
import { Group } from "../user/model/group.model";
import { School } from "../user/model/school.model";
import { Grade } from "../school-grade/grade.model";
import { ReportOptions } from "./report-options.model";
import { TranslateService } from "@ngx-translate/core";
import { Injectable } from "@angular/core";

@Injectable()
export class ReportNamingService {

  private defaultLanguage: string = 'eng';

  constructor(private translate: TranslateService) {
  }

  nameStudentExamReport(student: Student, options: ReportOptions): string {
    return this.name(this.translate.instant('labels.personName', student), options);
  }

  nameGroupExamReport(group: Group, options: ReportOptions): string {
    return this.name(group.name, options);
  }

  nameSchoolGradeExamReport(school: School, grade: Grade, options: ReportOptions): string {
    return this.name(this.concat(school.name, this.translate.instant(`labels.grades.${grade.code}.short-name`)), options);
  }

  private name(target: string, options: ReportOptions): string {
    return this.concat(
      target,
      options.schoolYear.toString(),
      this.nameLanguage(options.language)
    );
  }

  private nameLanguage(code: string) {
    return code === this.defaultLanguage ? '' : this.translate.instant(`labels.languages.${code}.default`);
  }

  private concat(...values: string[]): string {
    return values.join(' ').trim();
  }

}
