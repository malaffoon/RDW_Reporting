import {Component, OnInit} from "@angular/core";
import {DataService} from "../shared/data.service";
import {ActivatedRoute} from "@angular/router";
import {Group} from "../shared/group";

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

  constructor(private service: DataService, private route: ActivatedRoute) {}

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
              this.group = group;
            });
        }

      })
  }

}
