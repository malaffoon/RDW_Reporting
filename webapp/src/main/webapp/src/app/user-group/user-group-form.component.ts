import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserGroupFormOptions } from './user-group-form-options';
import { Student } from '../student/search/student';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { notEmpty } from '../shared/form/validators';
import { UserGroup } from './user-group';

@Component({
  selector: 'user-group-form',
  templateUrl: './user-group-form.component.html'
})
export class UserGroupFormComponent implements OnInit {

  @Input()
  options: UserGroupFormOptions;

  @Input()
  group: UserGroup;

  @Output()
  nameChange: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  subjectsChange: EventEmitter<string[]> = new EventEmitter<string[]>();

  @Output()
  studentsChange: EventEmitter<Student[]> = new EventEmitter<Student[]>();

  @Output()
  studentClick: EventEmitter<Student> = new EventEmitter<Student>();

  private _formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }

  get formGroup(): FormGroup {
    return this._formGroup;
  }

  get studentsControl(): AbstractControl {
    return this.formGroup.get('students');
  }

  ngOnInit(): void {
    this._formGroup = this.formBuilder.group({
      name: [ this.group.name ],
      students: [ this.group.students, notEmpty({ messageId: 'user-group.field.students-empty-error' }) ]
    });
  }

  onNameChange(): void {
    this.nameChange.emit(this.group.name);
  }

  onSubjectsChange(): void {
    this.subjectsChange.emit(this.group.subjects);
  }

  onStudentClick(student: Student): void {
    this.group.students = this.group.students
      .filter(x => x.id !== student.id);

    // Hacky intervention to get angular form validation to kick in
    this.studentsControl.setValue(this.group.students);

    this.studentsChange.emit(this.group.students);
  }

}
