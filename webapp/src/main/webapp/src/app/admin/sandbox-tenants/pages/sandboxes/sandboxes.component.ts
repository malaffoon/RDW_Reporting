import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SandboxConfiguration } from '../../model/sandbox-configuration';
import { SandboxService } from '../../service/sandbox.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Observable } from 'rxjs';
import { DeleteSandboxConfigurationModalComponent } from '../../modal/delete-sandbox.modal';
import { RdwTranslateLoader } from '../../../../shared/i18n/rdw-translate-loader';
import { SandboxStore } from '../../store/sandbox.store';
import { map } from 'rxjs/operators';
import { LanguageStore } from '../../../../shared/i18n/language.store';
import { NotificationService } from '../../../../shared/notification/notification.service';
import { UserService } from '../../../../shared/security/user.service';

@Component({
  selector: 'sandboxes',
  templateUrl: './sandboxes.component.html'
})
export class SandboxesComponent implements OnInit {
  sandboxes$: Observable<SandboxConfiguration[]>;
  localizationDefaults$: Observable<any>;
  writable$: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private service: SandboxService,
    private store: SandboxStore,
    private userService: UserService,
    private languageStore: LanguageStore,
    private translationLoader: RdwTranslateLoader,
    private modalService: BsModalService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.sandboxes$ = this.store.getState();
    this.service.getAll().subscribe(sandboxes => {
      this.store.setState(sandboxes);
    });

    this.localizationDefaults$ = this.translationLoader.getFlattenedTranslations(
      this.languageStore.currentLanguage
    );

    this.writable$ = this.userService
      .getUser()
      .pipe(map(({ permissions }) => permissions.includes('TENANT_WRITE')));
  }

  onDelete(value: SandboxConfiguration): void {
    const modalReference: BsModalRef = this.modalService.show(
      DeleteSandboxConfigurationModalComponent
    );
    const modal: DeleteSandboxConfigurationModalComponent =
      modalReference.content;
    modal.sandbox = value;
    modal.deleted.subscribe(() => {
      this.store.setState(
        this.store.state.filter(({ code }) => code !== value.code)
      );
    });
  }

  onSave(value: SandboxConfiguration): void {
    this.service.update(value).subscribe(
      () => {
        this.store.setState(
          this.store.state.map(existing =>
            existing.code === value.code ? value : existing
          )
        );
      },
      error => {
        error.json().message != null
          ? this.notificationService.error({ id: error.json().message })
          : this.notificationService.error({
              id: 'sandbox-config.errors.update'
            });
      }
    );
  }
}
