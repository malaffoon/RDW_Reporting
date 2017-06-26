import { Injectable } from "@angular/core";
import { DataService } from "../shared/data/data.service";
import { URLSearchParams } from "@angular/http";
import { Observable } from "rxjs";
import { School } from "./school.model";
import { isNullOrUndefined } from "util";
import { Grade } from "./grade.model";

/**
 * This service is responsible for retrieving schools.
 */
@Injectable()
export class SchoolService {

  constructor(private dataService: DataService) {
  }

  /**
   * Find a collection of schools by name.
   * NOTE: Result set size is limited by the server.
   *
   * @param nameQuery                 The school name query
   * @returns {Observable<School[]>}  Observable of the matching schools
   */
  getAvailableSchools(): Observable<School[]> {
    // TODO: This should be coming from the user context.
    // TODO: This is just a HACK until api portion is complete.
    let params = new URLSearchParams();
    params.set('name', '%');

    return this.dataService
      .get('/schools', { search: params })
      .map((apiSchools) => this.mapSchoolsFromApi(apiSchools));
  }

  /**
   * Given a school, find the grades with visible assessments.
   *
   * @param school                  A school
   * @returns {Observable<number>}  Observable of the grades with visible assessments
   */
  findGradesWithAssessmentsForSchool(school: School): Observable<Grade[]> {
    return this.dataService
      .get(`/schools/${school.id}/assessmentGrades`)
      .map((apiGrades) => this.mapGradesFromApi(apiGrades));
  }

  /**
   * Map an array of api schools to School models.
   *
   * @param apiSchools An array of api schools
   * @returns {School[]} An array of school models
   */
  private mapSchoolsFromApi(apiSchools: any[]): School[] {
    if (isNullOrUndefined(apiSchools)) return [];
    return apiSchools
      .filter(apiSchool => this.isSchoolValid(apiSchool))
      .map((apiSchool) => this.mapSchoolFromApi(apiSchool));
  }

  private mapSchoolFromApi(apiModel: any): School {
    let uiModel = new School();

    uiModel.id = apiModel.id;
    uiModel.name = apiModel.name;

    return uiModel;
  }

  private mapGradesFromApi(apiGrades: any[]): Grade[] {
    if (isNullOrUndefined(apiGrades)) return [];
    return apiGrades
      .filter(apiGrade => !isNullOrUndefined(apiGrade) && !isNullOrUndefined(apiGrade.code))
      .map(apiGrade => this.mapGradeFromApi(apiGrade));
  }

  private mapGradeFromApi(apiModel: any): Grade {
    let uiModel = new Grade();

    uiModel.id = apiModel.id;
    uiModel.code = apiModel.code;

    return uiModel;
  }

  private isSchoolValid(school: any){
    return !isNullOrUndefined(school) && !isNullOrUndefined(school.id) && !isNullOrUndefined(school.name);
  }
}
