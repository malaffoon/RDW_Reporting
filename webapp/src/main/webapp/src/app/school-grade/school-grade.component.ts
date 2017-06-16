import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { School } from "../shared/model/school.model";
import { SchoolService } from "../shared/data/school.service";
import { TypeaheadMatch } from "ngx-bootstrap";
import { isNullOrUndefined } from "util";

/**
 * This component is responsible for displaying a search widget allowing
 * users to find assessments by school and grade.
 */
@Component({
  selector: 'school-grade',
  templateUrl: './school-grade.component.html'
})
export class SchoolGradeComponent {

  asyncSelected: string;
  typeaheadLoading: boolean;
  typeaheadNoResults: boolean;
  selectedSchool: School;
  availableGrades: number[];
  findSchools: Observable<School[]>;
  noGradesAvailable: boolean;

  constructor(private schoolService: SchoolService) {
    this.availableGrades = [];

    // Declare a data-providing Observable used by the typeahead widget
    // to search for schools.
    this.findSchools = Observable
      .create((observer: any) => {
        observer.next(this.asyncSelected)
      })
      .debounceTime(300)
      .mergeMap((token: string) => {
        console.log("Looking up: " + token);
        return token.length < 2 ? []
          : this.schoolService.findByName(token)
      });
  }

  /**
   * @param loading True if the typeahead widget is currently loading results
   */
  changeTypeaheadLoading(loading: boolean): void {
    this.typeaheadLoading = loading;
  }

  /**
   * @param noResults True if the typeahead widget has found no results
   */
  changeTypeaheadNoResults(noResults: boolean): void {
    this.typeaheadNoResults = noResults;
  }

  /**
   * @param match The user-selected matching school
   */
  typeaheadOnSelect(match: TypeaheadMatch): void {
    this.selectedSchool = match.item;
    this.noGradesAvailable = false;
    if (isNullOrUndefined(this.selectedSchool)) {
      this.availableGrades = [];
      return;
    }

    // On school selection, find the grades with available assessments
    this.schoolService.findGradesWithAssessmentsForSchool(this.selectedSchool)
      .subscribe((grades) => {
        this.availableGrades = grades;
        this.noGradesAvailable = this.availableGrades.length == 0;
      });
  }

}
