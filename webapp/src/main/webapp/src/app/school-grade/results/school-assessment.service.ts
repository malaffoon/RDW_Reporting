import { Injectable } from "@angular/core";
import { URLSearchParams } from "@angular/http";
import { AssessmentExamMapper } from "../../assessments/assessment-exam.mapper";
import { ExamFilterOptionsService } from "../../assessments/filters/exam-filters/exam-filter-options.service";
import { AssessmentProvider } from "../../assessments/assessment-provider.interface";
import { ResponseUtils } from "../../shared/response-utils";
import { Grade } from "../grade.model";
import { DataService } from "../../shared/data/data.service";
import { Utils } from "../../shared/support/support";
import { catchError, map } from 'rxjs/operators';

const ServiceRoute = '/reporting-service';

@Injectable()
export class SchoolAssessmentService implements AssessmentProvider {

  schoolId: number;
  schoolName: string;
  grade: Grade;
  schoolYear: number;

  constructor(private dataService: DataService,
              private filterOptionService: ExamFilterOptionsService,
              private mapper: AssessmentExamMapper) {
  }

  getMostRecentAssessment(schoolId: number, gradeId: number, schoolYear?: number) {
    if (Utils.isNullOrUndefined(schoolYear)) {
      return this.filterOptionService.getExamFilterOptions().mergeMap(options => {
        return this.getRecentAssessmentBySchoolYear(schoolId, gradeId, options.schoolYears[ 0 ]);
      });
    }
    return this.getRecentAssessmentBySchoolYear(schoolId, gradeId, schoolYear);
  }

  getAvailableAssessments() {
    return this.dataService.get(`${ServiceRoute}/schools/${this.schoolId}/assessmentGrades/${this.grade.id}/assessments`, {
      search: this.getSchoolYearParams(this.schoolYear)
    }).pipe(
      catchError(ResponseUtils.badResponseToNull),
      map(serverAssessments => this.mapper.mapAssessmentsFromApi(serverAssessments))
    );
  }

  getExams(assessmentId: number) {
    return this.dataService.get(`${ServiceRoute}/schools/${this.schoolId}/assessmentGrades/${this.grade.id}/assessments/${assessmentId}/exams`, {
      search: this.getSchoolYearParams(this.schoolYear)
    }).pipe(
      catchError(ResponseUtils.badResponseToNull),
      map(serverExams => this.mapper.mapExamsFromApi(serverExams))
    );
  }

  getSchoolId() {
    return this.schoolId;
  }

  getAssessmentItems(assessmentId: number, itemTypes?: string[]) {
    return this.dataService.get(`${ServiceRoute}/schools/${this.schoolId}/assessmentGrades/${this.grade.id}/assessments/${assessmentId}/examitems`, {
      params: {
        types: itemTypes,
        schoolYear: this.schoolYear.toString()
      }
    }).pipe(
      catchError(ResponseUtils.badResponseToNull),
      map(serverAssessments => this.mapper.mapAssessmentItemsFromApi(serverAssessments))
    );
  }

  private getRecentAssessmentBySchoolYear(schoolId: number, gradeId: number, schoolYear: number) {
    return this.dataService.get(`${ServiceRoute}/schools/${schoolId}/assessmentGrades/${gradeId}/latestassessment`, {
      search: this.getSchoolYearParams(schoolYear)
    }).pipe(
      catchError(ResponseUtils.badResponseToNull),
      map(serverAssessment => {
        if (serverAssessment == null) {
          return null;
        }
        this.mapper.mapFromApi(serverAssessment)
      })
    );
  }

  private getSchoolYearParams(schoolYear: number): URLSearchParams {
    const params: URLSearchParams = new URLSearchParams();
    params.set('schoolYear', schoolYear.toString());
    return params;
  }

}
