import { Injectable } from "@angular/core";
import { DataService } from "./data.service";
import { URLSearchParams } from "@angular/http";
import { Observable } from "rxjs";
import { School } from "../model/school.model";
import { isNullOrUndefined } from "util";
import { Grade } from "../model/grade.model";
import { isNumeric } from "@angular/common/src/pipes/number_pipe";
import { isNumber } from "util";

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
  findByName(nameQuery: string): Observable<School[]> {
    let params = new URLSearchParams();
    params.set('name', nameQuery);

    let testData = [
      {id: 123, name: "School A"},
      {id: 456, name: "School B"},
      {id: 234, name: "School C"}];
    return Observable.of(testData)
      .map((apiSchools) => this.mapSchoolsFromApi(apiSchools));

    // return this.dataService.get('/schools', { search: params })
    //   .map((apiSchools) => this.mapSchoolsFromApi(apiSchools));
  }

  /**
   * Given a school, find the grades with visible assessments.
   *
   * @param school                  A school
   * @returns {Observable<number>}  Observable of the grades with visible assessments
   */
  findGradesWithAssessmentsForSchool(school: School): Observable<number[]> {
    if (school.id === 123) {
      return Observable.of([3, 5]);
    }
    if (school.id === 456) {
      return Observable.of([4, 9]);
    }
    return Observable.of([]);

    // return this.dataService.get(`/schools/{school.id}/grades`)
    //   .map((apiGrades) => this.mapGradesFromApi(apiGrades));
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
      .map((apiSchool) => this.mapSchoolFromApi(apiSchool))
      .filter((school) => !isNullOrUndefined(school));
  }

  /**
   * Map an api school object to a School model.
   *
   * @param apiSchool   An api school object
   * @returns {School}  A School model
   */
  private mapSchoolFromApi(apiSchool: any): School {
    if (isNullOrUndefined(apiSchool) ||
      isNullOrUndefined(apiSchool.id) ||
      isNullOrUndefined(apiSchool.name)) return;

    return new School(apiSchool.id, apiSchool.name);
  }

  private mapGradesFromApi(apiGrades: any[]): number[] {
    if (isNullOrUndefined(apiGrades)) return [];
    return apiGrades
      .filter((apiGrade) => isNumber(apiGrade))
      .map((apiGrade) => <number>apiGrade);
  }
}
