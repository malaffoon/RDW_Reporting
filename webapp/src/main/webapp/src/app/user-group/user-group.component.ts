import { Component, OnInit } from '@angular/core';
import { UserGroupService } from './user-group.service';
import { UserGroup } from './user-group';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamFilterOptions } from '../assessments/model/exam-filter-options.model';
import { ExamFilterOptionsService } from '../assessments/filters/exam-filters/exam-filter-options.service';


@Component({
  selector: 'user-group',
  templateUrl: './user-group.component.html'
})
export class UserGroupComponent implements OnInit {

  options: ExamFilterOptions;
  group: UserGroup;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private optionService: ExamFilterOptionsService,
              private service: UserGroupService) {
    this.group = this.route.snapshot.data[ 'group' ];
  }

  get loading(): boolean {
    return this.options == null;
  }

  ngOnInit(): void {
    this.optionService.getExamFilterOptions()
      .subscribe(options => this.options = options);
  }

  onSaveButtonClick(): void {
    // TODO only save when there are changes
    this.service.saveGroup(this.group)
      .subscribe(created => {
        // if (this.group.id == null) {
        //   (<any>this.group).id = created.id;
        // }
        this.router.navigate(['']);
      });
  }

}

