import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../shared/data.service";
import {Group} from "../shared/group";

@Component({
  selector: 'app-group',
  templateUrl: 'students.component.html',
  styleUrls: ['students.component.css']
})
export class StudentsComponent implements OnInit {

  group: Group = null;

  constructor(private service: DataService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        this.service.getGroup(params['groupId'])
          .subscribe(group => {
              this.group = group;
            },
            error => {
              console.error(error);
            })

      })
  }

}
