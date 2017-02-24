import {Component, OnInit, EventEmitter, Output} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../shared/data.service";
import {Group} from "../shared/group";
import {sortOn} from "../shared/comparators";
import {Student} from "../shared/student";

@Component({
  selector: 'students-component',
  templateUrl: 'students.component.html',
  styleUrls: ['students.component.less']
})
export class StudentsComponent implements OnInit {

  private group: Group = null;
  private context: any;

  constructor(private service: DataService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        this.service.getGroup(params['groupId'])
          .subscribe((group: any) => {
              group.students = sortOn(group.students, student => student.lastName, student => student.firstName);
              this.group = group;
              this.context = {
                breadcrumbs: [
                  {name: group.name}
                ]
              }
            },
            error => {
              console.error(error);
            })

      })
  }

}
