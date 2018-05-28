import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UserGroupService } from './user-group.service';
import { copy, equals, UserGroup } from './user-group';
import { ActivatedRoute, Router } from '@angular/router';
import { Option } from '../shared/form/option';
import { TranslateService } from '@ngx-translate/core';
import { UserGroupOptionsService } from './user-group-options.service';
import { UserGroupFormOptions } from './user-group-form-options';
import { NotificationService } from '../shared/notification/notification.service';
import { Subscription } from 'rxjs/Subscription';
import { StudentSearchFormOptions } from '../student/search/student-search-form-options';
import { StudentSearchFormOptionsService } from '../student/search/student-search-form-options.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Student } from '../student/search/student';
import { StudentSearchForm } from '../student/search/student-search-form';
import { StudentSearch, StudentService } from '../student/search/student.service';
import { byString, join } from '@kourge/ordering/comparator';
import { ordering } from '@kourge/ordering';
import { UserGroupFormComponent } from './user-group-form.component';

const StudentComparator = join(
  ordering(byString).on<Student>(student => student.lastName).compare,
  ordering(byString).on<Student>(student => student.firstName).compare
);

@Component({
  selector: 'user-group',
  templateUrl: './user-group.component.html'
})
export class UserGroupComponent implements OnInit, OnDestroy {

  // group
  formOptions: UserGroupFormOptions;
  originalGroup: UserGroup;
  group: UserGroup;

  // student
  studentFormOptions: StudentSearchFormOptions;
  studentForm: StudentSearchForm;
  students: Student[] = [];
  filteredStudents: Student[] = [];

  processingSubscription: Subscription;
  initialized: boolean;

  @ViewChild('groupForm')
  groupForm: UserGroupFormComponent;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private optionService: UserGroupOptionsService,
              private service: UserGroupService,
              private studentFormOptionService: StudentSearchFormOptionsService,
              private studentService: StudentService,
              private translate: TranslateService,
              private notificationService: NotificationService) {
    this.originalGroup = this.route.snapshot.data[ 'group' ];
  }

  get saveButtonDisabled(): boolean {
    return this.processingSubscription != null
      || this.groupForm == null
      || !this.groupForm.formGroup.valid
      || equals(this.originalGroup, this.group);
  }

  get deleteButtonDisabled(): boolean {
    return this.processingSubscription != null;
  }

  ngOnInit(): void {
    forkJoin(
      this.optionService.getOptions(),
      this.studentFormOptionService.getOptions()
    ).subscribe(([ options, studentFormOptions ]) => {

      // setup group form
      this.formOptions = <UserGroupFormOptions>{
        subjects: options.subjects.map(code => <Option>{
          value: code,
          text: this.translate.instant('common.subject.' + code + '.name'),
          analyticsProperties: {
            label: `Subject: ${code}`
          }
        })
      };

      if (this.originalGroup == null) {
        this.group = <UserGroup>{
          name: '',
          subjectCodes: options.subjects.concat(),
          students: []
        };
      } else {
        if (this.originalGroup.subjectCodes == null) {
          this.originalGroup.subjectCodes = options.subjects.concat();
        }
        this.group = copy(this.originalGroup);
      }



      // setup student form
      this.studentFormOptions = {
        schools: studentFormOptions.schools,
        groups: this.originalGroup == null
          ? studentFormOptions.groups
          : studentFormOptions.groups
            .filter(group => !(group.userCreated && group.id === this.originalGroup.id))
      };
      this.studentForm = {
        school: studentFormOptions.schools[ 0 ],
        name: ''
      };

      this.initialized = true;

      this.searchStudents();
    });
  }

  ngOnDestroy(): void {
    if (this.processingSubscription != null) {
      this.unsubscribe();
    }
  }

  onCancelButtonClick(): void {
    this.navigateHome();
  }

  onSaveButtonClick(): void {
    if (this.saveButtonDisabled) {
      return;
    }
    // TODO only save when there are changes
    this.processingSubscription = this.service.saveGroup(this.group)
      .subscribe(() => {
          this.navigateHome();
        },
        () => {
          this.notificationService.error({ id: 'user-group.save-error' });
        }, () => {
          this.unsubscribe();
        });
  }

  onDeleteButtonClick(): void {
    this.processingSubscription = this.service.deleteGroup(this.group)
      .subscribe(() => {
          this.navigateHome();
        },
        () => {
          this.notificationService.error({ id: 'user-group.delete-error' });
        }, () => {
          this.unsubscribe();
        });
  }

  onStudentFormSearchChange(): void {
    this.searchStudents();
  }

  onStudentFormFilterChange(): void {
    this.updateFormStudents();
  }

  onGroupStudentClick(student: Student): void {
    this.group.students = this.group.students
      .filter(x => x !== student)
      .sort(StudentComparator);
    this.updateFormStudents();
  }

  onFormStudentClick(student: Student): void {
    this.group.students = this.group.students
      .concat(student)
      .sort(StudentComparator);
    this.updateFormStudents();
  }

  private navigateHome(): void {
    this.router.navigate([ '' ]);
  }

  private unsubscribe(): void {
    this.processingSubscription.unsubscribe();
    this.processingSubscription = null;
  }

  private searchStudents(): void {
    const search = this.createStudentSearch(this.studentForm);
    if (search != null) {
      this.studentService.getStudents(search)
        .subscribe(students => {
          this.students = students.sort(StudentComparator);
          this.updateFormStudents();
        });
    }
  }

  private createStudentSearch(searchForm: StudentSearchForm): StudentSearch {
    if (searchForm.school) {
      return { schoolId: searchForm.school.id };
    }
    if (searchForm.group) {
      return { groupId: searchForm.group.id };
    }
    return null;
  }

  private updateFormStudents(): void {
    const nameSearch = (this.studentForm.name || '')
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '');

    this.filteredStudents = this.students
      .filter(student => {
        return this.group.students.find(x => x.id === student.id) == null
          && (
            student.ssid.startsWith(this.studentForm.name)
            || `${(student.lastName + student.firstName).toLowerCase()}`.includes(nameSearch)
            || `${(student.firstName + student.lastName).toLowerCase()}`.includes(nameSearch)
          );
      })
      .sort(StudentComparator);
  }


}

