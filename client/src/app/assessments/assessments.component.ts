import {Component, OnInit} from "@angular/core";
import {DataService} from "../shared/data.service";
import {ActivatedRoute} from "@angular/router";
import {Group} from "../shared/group";

@Component({
  selector: 'app-assessments',
  templateUrl: './assessments.component.html',
  styleUrls: ['./assessments.component.css']
})
export class AssessmentsComponent implements OnInit {

  private group: Group;

  constructor(private service: DataService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params
      .subscribe(params => {

        let groupId = params['groupId'];
        let studentId = params['studentId'];

        if (studentId == null) {

          // aggregate
          this.service.getGroupAssessments(groupId)
            .subscribe(group => {
              this.group = group;
            });

        } else {

          // individual
          this.service.getStudentAssessments(groupId, studentId)
            .subscribe(group => {
              this.group = group;
            });
        }

      })
  }

}
