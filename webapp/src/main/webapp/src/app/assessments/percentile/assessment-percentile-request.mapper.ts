import { Injectable } from "@angular/core";
import { AssessmentExam } from "../model/assessment-exam.model";
import { AssessmentPercentileRequest } from "./assessment-percentile.service";
import { DatePipe } from "@angular/common";

@Injectable()
export class AssessmentPercentileRequestMapper {

  constructor(private datePipe: DatePipe){
  }

  fromAssessmentResults(results: AssessmentExam): AssessmentPercentileRequest {
    const dates = results.exams.map(exam => new Date(exam.date)).sort();
    const toLocalDateString = date => this.datePipe.transform(date, 'yyyy-MM-dd');
    return {
      assessmentId: results.assessment.id,
      startDate: toLocalDateString(dates[0]),
      endDate: toLocalDateString(dates[ dates.length - 1 ])
    };
  }

}
