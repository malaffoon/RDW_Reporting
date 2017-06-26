import { Component, OnInit } from "@angular/core";
import { School } from "./school.model";
import { SchoolService } from "./school.service";
import { isNullOrUndefined } from "util";
import { Grade } from "./grade.model";
import { FormGroup, FormControl, Validators } from "@angular/forms";

/**
 * This component is responsible for displaying a search widget allowing
 * users to find assessments by school and grade.
 */
@Component({
  selector: 'school-grade',
  templateUrl: './school-grade.component.html'
})
export class SchoolGradeComponent implements OnInit {
  searchForm: FormGroup;
  selectNullOptionValue: any = null;

  availableGrades: Grade[] = [];
  availableSchools: any[] = [];

  gradesAreUnavailable: boolean = false;

  constructor(private schoolService: SchoolService) {
    this.availableGrades = [];
  }

  ngOnInit() {
    this.searchForm = new FormGroup({
      school: new FormControl(null, Validators.required),
      grade: new FormControl({ value: this.selectNullOptionValue, disabled: true }, Validators.required)
    });

    this.searchForm.controls[ "school" ].valueChanges.subscribe(school => this.schoolChanged(school));
    this.loadAvailableSchools();
  }

  performSearch() {
    if(this.searchForm.valid) {
      console.log(`Navigate to some determined route such as: results?schoolId=${this.schoolControl.value.id}&grade=${this.gradeControl.value.id}`);
    }
  }

  private get gradeControl() {
    return this.searchForm.controls[ "grade" ];
  }

  private get schoolControl() {
    return this.searchForm.controls[ "school" ];
  }

  private schoolChanged(school: School) {
    this.availableGrades = [];
    this.gradesAreUnavailable = false;

    this.gradeControl.disable();

    if (!isNullOrUndefined(school)) {
      this.loadAvailableGrades(school);
    }
  }

  private loadAvailableSchools() {
    // TODO: This should come from the user context.
    this.schoolService.getAvailableSchools().subscribe((schools) => {
      this.availableSchools = schools.map(school => {
        return {
          label: school.name,
          value: school
        };
      });

      if(this.availableSchools.length == 1){
        this.schoolControl.setValue(this.availableSchools[0]);
      }
    });
  }

  private loadAvailableGrades(school: School) {
    this.schoolService
      .findGradesWithAssessmentsForSchool(school)
      .subscribe(grades => {
        this.availableGrades = grades;
        this.gradesAreUnavailable = grades.length == 0;

        if (!this.gradesAreUnavailable)
          this.gradeControl.enable();

        if (grades.length == 1) {
          this.gradeControl.setValue(grades[ 0 ]);
        }
        else {
          this.gradeControl.setValue(this.selectNullOptionValue);
        }
      });
  }
}
