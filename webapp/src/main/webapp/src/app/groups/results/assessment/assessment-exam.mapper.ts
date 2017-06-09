import { Injectable } from "@angular/core";
import { AssessmentExam } from "../model/assessment-exam.model";
import { Assessment } from "../model/assessment.model";
import { Exam } from "../model/exam.model";
import { AssessmentType } from "../../../shared/enum/assessment-type.enum";

@Injectable()
export class AssessmentExamMapper {
  mapFromApi(apiModel): AssessmentExam {
    let uiModel = new AssessmentExam();

    uiModel.assessment = this.mapAssessmentFromApi(apiModel.assessment);
    uiModel.exams = [];

    apiModel.exams.forEach(x =>
      uiModel.exams.push(this.mapExamFromApi(x))
    );

    return uiModel;
  }

  private mapAssessmentFromApi(apiModel): Assessment {
    let uiModel = new Assessment();

    uiModel.id = apiModel.id;
    uiModel.name = apiModel.name;
    uiModel.grade = apiModel.gradeId;
    uiModel.type = AssessmentType[apiModel.type as string];

    return uiModel;
  }

  private mapExamFromApi(apiModel): Exam {
    let uiModel : Exam = new Exam();

    uiModel.date = apiModel.dateTime;
    uiModel.session = apiModel.sessionId;
    uiModel.enrolledGrade = apiModel.studentContext.gradeId;
    uiModel.studentName = `${apiModel.student.lastName}, ${apiModel.student.firstName}`;

    uiModel.score = apiModel.scaleScore.value;
    uiModel.level = apiModel.scaleScore.level;
    uiModel.standardError = apiModel.scaleScore.standardError;

    uiModel.administrativeCondition = apiModel.administrativeConditionId;
    uiModel.completeness = apiModel.completenessId;

    uiModel.gender = apiModel.student.genderId;
    uiModel.migrantStatus = apiModel.studentContext.migrantStatus;
    uiModel.plan504 = apiModel.studentContext.section504;
    uiModel.iep = apiModel.studentContext.iep;
    uiModel.economicDisadvantage = apiModel.studentContext.economicDisadvantage;
    uiModel.limitedEnglishProficiency = apiModel.studentContext.lep;

    uiModel.ethnicities = [];

    if(apiModel.student.ethnicityCodes)
      apiModel.student.ethnicityCodes.forEach(code => uiModel.ethnicities.push(code));

    return uiModel;
  }
}

