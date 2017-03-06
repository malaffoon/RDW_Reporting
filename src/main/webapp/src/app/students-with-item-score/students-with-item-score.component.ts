import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../shared/data.service";
import {TranslateService} from "ng2-translate";
import {Observable} from "rxjs";
import {group} from "../standalone/data/group";

@Component({
  selector: 'students-with-item-score',
  templateUrl: 'students-with-item-score.component.html'
})
export class StudentsWithItemScoreComponent implements OnInit {

  private breadcrumbs = [];

  private item = null;
  private items = [];

  constructor(private service: DataService, private route: ActivatedRoute, private translate: TranslateService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      //this.service.getStudentsWithItemScore(params['groupId'], params['examId'], params['itemId'], params['score']).subscribe(group => {
        this.translate.get('labels.assessment.grade').subscribe(breadcrumbName => {

          let exam = group.exams[0];

          let item = {
            number: 6,
            name: 'Concepts and Procedures',
            target: 'Target F',
            maximumScore: 2,
            score: 1
          };

          let items = [
            {student: {lastName: 'Hayden', firstName: 'David'}, exam: {grade: 3, date: new Date(2017, 10, 14), session: 'ma-06', attempt: 1}},
            {student: {lastName: 'Roach', firstName: 'Clementine'}, exam: {grade: 4, date: new Date(2017, 10, 14), session: 'ma-06', attempt: 1}},
            {student: {lastName: 'Valenzuela', firstName: 'Hasad'}, exam: {grade: 4, date: new Date(2017, 10, 15), session: 'ma-08', attempt: 2}},
            {student: {lastName: 'Smith', firstName: 'Joe'}, exam: {grade: 4, date: new Date(2017, 10, 15), session: 'ma-08', attempt: 2}},
            {student: {lastName: 'Cleveland', firstName: 'Joseph'}, exam: {grade: 4, date: new Date(2017, 10, 15), session: 'ma-08', attempt: 2}},
            {student: {lastName: 'Blankenship', firstName: 'Sara'}, exam: {grade: 4, date: new Date(2017, 10, 15), session: 'ma-08', attempt: 2}},
            {student: {lastName: 'Todd', firstName: 'Linus'}, exam: {grade: 4, date: new Date(2017, 10, 15), session: 'ma-08', attempt: 2}}
          ].map(object => {
            object.exam = Object.assign(object.exam, exam);
            return Object.assign(object, item);
          });

          this.breadcrumbs = [
            {name: group.name, path: `/groups/${group.id}/students`},
            {name: 'Aggregate', path: `/groups/${group.id}/exams`},
            {name: `${breadcrumbName} ${exam.assessment.grade} ${exam.assessment.name} #${item.number}`}
          ];

          this.item = item;
          this.items = items;

        })
      //})
    });
  }

}
