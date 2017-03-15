import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../shared/data.service";
import {TranslateService} from "ng2-translate";
import {group} from "../standalone/data/group";
import {item_1, items as mock_items} from "../standalone/data/data";

@Component({
  selector: 'students-with-item-score',
  templateUrl: 'students-with-item-score.component.html'
})
export class GroupExamItemComponent implements OnInit {

  private breadcrumbs = [];

  private item = null;
  private items = [];

  constructor(private service: DataService, private route: ActivatedRoute, private translate: TranslateService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {

      // branch behavior on presence of params['score']

      //this.service.getGroupExamItemWithScore(params['groupId'], params['examId'], params['itemId'], params['score']).subscribe(group => {
        this.translate.get('labels.assessment.grade').subscribe(breadcrumbName => {

          let exam = group.exams[0];

          let item = item_1;
          let items = mock_items.filter(item => item.score == parseInt(params['score']));

          this.breadcrumbs = [
            {name: group.name, path: `/groups/${group.id}/students`},
            {name: 'Aggregate', path: `/groups/${group.id}/exams`},
            {name: `${breadcrumbName} ${exam.assessment.grade} ${exam.assessment.name} #${item.number}`}
          ];

          this.item = item;
          this.items = items;

        });
      //})
    });
  }

}
