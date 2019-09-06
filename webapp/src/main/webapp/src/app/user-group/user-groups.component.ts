import { Component, Input, OnInit } from '@angular/core';
import { UserGroupService } from './user-group.service';
import { UserGroup } from './user-group';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { Group } from '../groups/group';
import { SubjectService } from '../subject/subject.service';
import { UserService } from '../shared/security/service/user.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'user-groups',
  templateUrl: './user-groups.component.html'
})
export class UserGroupsComponent implements OnInit {
  /**
   * The assigned groups
   */
  @Input()
  assignedGroups: Group[];

  /**
   * The user created groups
   */
  @Input()
  groups: UserGroup[];

  defaultGroup: UserGroup;
  subjects: string[];
  createButtonDisabled: boolean = true;

  search: string;
  searchThreshold: number = 10;
  filteredGroups: UserGroup[];

  initialized: boolean = false;

  constructor(
    private service: UserGroupService,
    private subjectService: SubjectService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    forkJoin(
      this.subjectService.getSubjectCodes(),
      this.userService
        .getUser()
        .pipe(
          map(({ permissions }) => permissions.includes('INDIVIDUAL_PII_READ'))
        )
    ).subscribe(([subjects, hasPiiRead]) => {
      this.filteredGroups = this.groups.concat();
      if (this.groups.length !== 0) {
        this.defaultGroup = this.groups[0];
      }
      this.subjects = subjects;
      this.createButtonDisabled =
        this.assignedGroups.length === 0 && !hasPiiRead;
      this.initialized = true;
    });
  }

  onSearchChange(): void {
    this.filteredGroups = this.groups.filter(group =>
      group.name.toLowerCase().includes(this.search.toLowerCase())
    );
  }

  onCreateButtonClick(): void {
    if (!this.createButtonDisabled) {
      this.router.navigate(['/user-groups']);
    }
  }
}
