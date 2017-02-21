import {Component, OnInit} from "@angular/core";
import {DataService} from "../shared/data.service";
import {ActivatedRoute} from "@angular/router";
import {Group} from "../shared/group";
import {AssessmentType} from "../shared/assessment-type.enum";

/**
 * Should split into two components for simplicity
 */
@Component({
  selector: 'exams-component',
  templateUrl: 'exams.component.html',
  styleUrls: ['exams.component.less']
})
export class ExamsComponent implements OnInit {

  private group: Group;
  private categories: any;

  constructor(private service: DataService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params
      .subscribe(params => {

        let groupId = params['groupId'];
        let studentId = params['studentId'];

        if (studentId == null) {

          // aggregate
          this.service.getGroupExams(groupId)
            .subscribe(group => {
              this.group = group;
            });

        } else {

          // individual
          this.service.getStudentExams(groupId, studentId)
            .subscribe(group => {

              let categories = {
                all: {exams: [], academicYears: new Set(), enrolledGrades: new Set(), assessmentTypes: new Set()},
                iab: {exams: [], academicYears: new Set(), enrolledGrades: new Set()},
                ica: {exams: [], academicYears: new Set(), enrolledGrades: new Set()},
                summative: {exams: [], academicYears: new Set(), enrolledGrades: new Set()}
              };

              group.students[0].exams.forEach(exam => {
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
              this.categories = categories;

              console.info(categories);

            });
        }

      })
  }

}
