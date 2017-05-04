import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {sortDescOn} from "../shared/comparators";

@Component({
  selector: 'student-exams-component',
  templateUrl: 'student-exams.component.html'
})
export class StudentExamsComponent implements OnInit {

  private student;
  private group;
  private categories;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
      let data = this.route.snapshot.data['studentData'];

      let group = data.group;
      let student = data.student;
      let exams = data.exams;

      let categories = {
        all: {exams: [], academicYears: new Set(), enrolledGrades: new Set(), assessmentTypes: new Set()},
        iab: {exams: [], academicYears: new Set(), enrolledGrades: new Set()},
        ica: {exams: [], academicYears: new Set(), enrolledGrades: new Set()},
        summative: {exams: [], academicYears: new Set(), enrolledGrades: new Set()}
      };

      sortDescOn(exams, exam => exam.date).forEach(exam => {
        categories.all.exams.push(exam);
        categories.all.academicYears.add(exam.assessment.academicYear);
        categories.all.enrolledGrades.add(exam.grade);
        categories.all.assessmentTypes.add(exam.assessment.type);
        let category = categories[['summative', 'ica', 'iab'][exam.assessment.type]];
        category.exams.push(exam);
        category.academicYears.add(exam.assessment.academicYear);
        category.enrolledGrades.add(exam.grade);
      });

      for (let categoryId in categories) {
        let category = categories[categoryId];
        category.sortedAcademicYears = Array.from(category.academicYears).sort();
        category.sortedEnrolledGrades = Array.from(category.enrolledGrades).sort();
        if (category.assessmentTypes) {
          category.sortedAssessmentTypes = Array.from(category.assessmentTypes).sort();
        }
      }

      this.group = group;
      this.student = student;
      this.categories = categories;
  }
}
