import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { URLSearchParams } from "@angular/http";
import { DataService } from "../../../shared/data.service";
import { AssessmentExamMapper } from "./assessment-exam.mapper";
import { ExamFilterOptionsService } from "../exam-filters/exam-filter-options.service";

@Injectable()
export class AssessmentService {
  constructor(private dataService: DataService, private filterOptionService: ExamFilterOptionsService, private mapper: AssessmentExamMapper) {
  }

  getMostRecentAssessment(groupId: number, schoolYear?: number) {
    if (schoolYear == undefined) {
      return this.filterOptionService.getExamFilterOptions().mergeMap(options => {
        return this.getRecentAssessmentBySchoolYear(groupId, options.schoolYears[ 0 ]);
      });
    }
    else {
      return this.getRecentAssessmentBySchoolYear(groupId, schoolYear);
    }
  }

  private getRecentAssessmentBySchoolYear(groupId: number, schoolYear: number) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('schoolYear', schoolYear.toString());

    return this.dataService.get(`/groups/${groupId}/latestassessment`, { search: params })
      .catch(response => {
        console.warn(response);
        return Observable.empty();
      })
      .map(x => {
        return this.mapper.mapFromApi(x);
      })

  }
}
