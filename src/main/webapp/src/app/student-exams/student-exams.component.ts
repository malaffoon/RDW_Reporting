import {Component, OnInit} from "@angular/core";
import {DataService} from "../shared/data.service";
import {ActivatedRoute} from "@angular/router";
import {Group} from "../shared/group";
import {BreadcrumbsComponent} from "../breadcrumbs/breadcrumbs.component";
import {sortOn, sortDescOn} from "../shared/comparators";

/**
 * Should split into two components for simplicity
 */
@Component({
  selector: 'student-exams-component',
  templateUrl: 'student-exams.component.html',
  styleUrls: ['student-exams.component.less']
})
export class StudentExamsComponent implements OnInit {

  private context: any;

  constructor(private service: DataService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        this.service.getStudentExams(params['groupId'], params['studentId'])
          .subscribe(group => {

            let student = group.students[0];

            let categories = {
              all: {exams: [], academicYears: new Set(), enrolledGrades: new Set(), assessmentTypes: new Set()},
              iab: {exams: [], academicYears: new Set(), enrolledGrades: new Set()},
              ica: {exams: [], academicYears: new Set(), enrolledGrades: new Set()},
              summative: {exams: [], academicYears: new Set(), enrolledGrades: new Set()}
            };

            sortDescOn(student.exams, exam => exam.date).forEach(exam => {
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

            this.context = {
              group: group,
              student: student,
              categories: categories,
              breadcrumbs: [
                {name: group.name, path: `/groups/${group.id}/students`},
                {name: `${student.lastName}, ${student.firstName}`}
              ]
            };

          });
      })
  }

}
