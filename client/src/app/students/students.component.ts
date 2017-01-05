import {Component, OnInit} from "@angular/core";
import {AssessmentService} from "../shared/assessment.service";

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

  students: any[] = [];

  constructor(private assessmentService: AssessmentService) {
  }

  ngOnInit() {
    this.assessmentService.getAssessmentsByStudents()
      .subscribe(
        students => {
          this.students = students;
        },
        error => {

        })
  }

}
