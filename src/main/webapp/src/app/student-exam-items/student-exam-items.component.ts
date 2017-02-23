import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../shared/data.service";

@Component({
  selector: 'app-student-exam-items',
  templateUrl: './student-exam-items.component.html',
  styleUrls: ['./student-exam-items.component.less']
})
export class StudentExamItemsComponent implements OnInit {

  private context: any;

  constructor(private service: DataService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        this.service.getStudentExam(params['groupId'], params['studentId'], params['examId'])
          .subscribe(group => {
            let student = group.students[0];
            let exam = group.students[0].exams[0];
            this.context = {
              group: group,
              student: student,
              exam: exam,
              breadcrumbs: [
                {name: group.name, path: `/groups/${group.id}/students`},
                {name: `${student.lastName}, ${student.firstName}`, path: `/groups/${group.id}/students/${student.id}/exams`},
                {name: `Grade ${exam.assessment.grade} ${exam.assessment.name}`}
              ]
            };
          });
      });
  }

}
