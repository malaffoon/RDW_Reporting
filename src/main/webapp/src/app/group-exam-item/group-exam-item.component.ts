import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {mock_item} from "../standalone/data/data";

@Component({
  selector: 'group-exam-item',
  templateUrl: 'group-exam-item.component.html'
})
export class GroupExamItemComponent implements OnInit {

  private group = null;
  private exam = null;
  private item = null;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {

      let data = this.route.snapshot.data['examData'];

      let group = data.group;
      let exam = data.item.exam;
      let item = Object.assign({}, data.item);

      // only necessary in mock so move to standalone service
      if (params['score'] != null) {
        item.results = mock_item.results.filter(item => item.score == parseInt(params['score']));
      }

      this.group = group;
      this.item = item;
      this.exam = exam;

    });
  }
}
