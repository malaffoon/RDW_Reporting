import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../shared/data.service";
import {TranslateService} from "ng2-translate";
import {Observable} from "rxjs";

@Component({
  selector: 'students-with-item-score',
  templateUrl: 'students-with-item-score.component.html'
})
export class StudentsWithItemScoreComponent implements OnInit {

  private context: Observable<any>;

  constructor(private service: DataService, private route: ActivatedRoute, private translate: TranslateService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.service.getStudentsWithItemScore(params['groupId'], params['examId'], params['itemId'], params['score']).subscribe(group => {
        this.translate.get('labels.assessment.grade').subscribe(breadcrumbName => {
          let student = group.students[0];
          let exam = student.exams[0];
          let item = exam.items[0];
          this.context = Observable.of({
            group: group,
            student: student,
            exam: exam,
            breadcrumbs: [
              {name: group.name, path: `/groups/${group.id}/students`},
              {name: `${breadcrumbName} ${exam.assessment.grade} ${exam.assessment.name}`},
              {name: item.name}
            ]
          });
        })
      })
    });
  }

}
