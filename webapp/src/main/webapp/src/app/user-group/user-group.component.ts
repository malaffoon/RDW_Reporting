import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserGroupService } from './user-group.service';
import { copy, equals, UserGroup } from './user-group';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Option } from '../shared/form/option';
import { TranslateService } from '@ngx-translate/core';
import { UserGroupOptionsService } from './user-group-options.service';
import { UserGroupFormOptions } from './user-group-form-options';
import { NotificationService } from '../shared/notification/notification.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'user-group',
  templateUrl: './user-group.component.html'
})
export class UserGroupComponent implements OnInit, OnDestroy {

  originalGroup: UserGroup;
  group: UserGroup;
  formOptions: UserGroupFormOptions;
  formGroup: FormGroup;
  processingSubscription: Subscription;
  initialized: boolean;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private optionService: UserGroupOptionsService,
              private service: UserGroupService,
              private translate: TranslateService,
              private notificationService: NotificationService) {
    this.originalGroup = this.route.snapshot.data[ 'group' ];
  }

  get saveButtonDisabled(): boolean {
    return this.processingSubscription != null
      || !this.formGroup.valid
      || equals(this.originalGroup, this.group);
  }

  get deleteButtonDisabled(): boolean {
    return this.processingSubscription != null;
  }

  ngOnInit(): void {
    this.optionService.getOptions()
      .subscribe(options => {

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
            (<any>this.originalGroup).subjectCodes = options.subjects.concat();
          }
          this.group = copy(this.originalGroup);
        }

        this.formGroup = this.formBuilder.group({
          name: [ this.group.name, [] ]
        });

        this.initialized = true;

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
        this.notificationService.error({id: 'user-group.save-error'});
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
        this.notificationService.error({id: 'user-group.delete-error'});
      }, () => {
        this.unsubscribe();
      });
  }

  private navigateHome(): void {
    this.router.navigate([ '' ]);
  }

  private unsubscribe(): void {
    this.processingSubscription.unsubscribe();
    this.processingSubscription = null;
  }

}

