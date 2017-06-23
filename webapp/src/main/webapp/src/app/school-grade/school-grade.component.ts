import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { School } from "./school.model";
import { SchoolService } from "./school.service";
import { TypeaheadMatch } from "ngx-bootstrap";
import { isNullOrUndefined } from "util";
import { Grade } from "./grade.model";

/**
 * This component is responsible for displaying a search widget allowing
 * users to find assessments by school and grade.
 */
@Component({
  selector: 'school-grade',
  templateUrl: './school-grade.component.html'
})
export class SchoolGradeComponent implements OnInit {

  asyncSelected: string;
  typeaheadLoading: boolean;
  typeaheadNoResults: boolean;

  availableGrades: Grade[];
  findSchools: Observable<School[]>;
  noGradesAvailable: boolean;
  selectUndefinedOptionValue:any;

  selectedSchool: School;
  selectedGrade: Grade;

  constructor(private schoolService: SchoolService) {
    this.availableGrades = [];
  }

  ngOnInit() {
    // Declare a data-providing Observable used by the typeahead widget
    // to search for schools.
    this.findSchools = Observable
      .create((observer: any) => {
        observer.next(this.asyncSelected)
      })
      .debounceTime(300)
      .mergeMap((input: string) => {
        console.log("Looking up: " + input);
        return input.length < 3
          ? []
          : this.schoolService.findByName(input)
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
      .subscribe(grades => {
        this.availableGrades = grades;
        this.noGradesAvailable = this.availableGrades.length == 0;
      });
  }

  performSearch(){
    console.log(`Navigate to some deterimined route such as: search?schoolId=${this.selectedSchool.id}&grade=${this.selectedGrade.id}`);
  }
}
