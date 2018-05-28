import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserGroupFormOptions } from './user-group-form-options';
import { Student } from '../student/search/student';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  studentClick: EventEmitter<Student> = new EventEmitter<Student>();

  private _formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }

  get formGroup(): FormGroup {
    return this._formGroup;
  }

  ngOnInit(): void {
    this._formGroup = this.formBuilder.group({
      name: [ this.group.name ],
      students: [ this.group.students, notEmpty({ messageId: 'notEmpty' }) ]
    });
  }

}
