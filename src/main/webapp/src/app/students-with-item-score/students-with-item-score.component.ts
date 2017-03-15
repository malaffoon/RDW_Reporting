import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../shared/data.service";
import {TranslateService} from "ng2-translate";
import {mock_item} from "../standalone/data/data";

@Component({
  selector: 'students-with-item-score',
  templateUrl: 'students-with-item-score.component.html'
})
export class GroupExamItemComponent implements OnInit {

  private breadcrumbs = [];
  private item = null;

  constructor(private service: DataService, private route: ActivatedRoute, private translate: TranslateService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {

      let groupId = params['groupId'];
      let examId = params['examId'];

      (params['score'] == null
          ? this.service.getGroupExamItem(groupId, examId, params['itemId'])
          : this.service.getGroupExamItemWithScore(groupId, examId, params['itemId'], params['score'])
      ).subscribe(data => {
        this.translate.get('labels.assessment.grade').subscribe(breadcrumbName => {

          let group = data.group;
          let exam = data.item.exam;
          let item = Object.assign({}, data.item);

          // only necessary in mock so move to standalone service
          if (params['score'] != null) {
            item.results = mock_item.results.filter(item => item.score == parseInt(params['score']));
          }

          this.breadcrumbs = [
            {name: group.name, path: `/groups/${groupId}/students`},
            {name: 'Aggregate', path: `/groups/${groupId}/exams`},
            {name: `${breadcrumbName} ${exam.assessment.grade} ${exam.assessment.name} #${item.number}`}
          ];

          this.item = item;

        });
      })
    });
  }

}
