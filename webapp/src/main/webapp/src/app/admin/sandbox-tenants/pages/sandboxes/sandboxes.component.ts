import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SandboxConfiguration } from '../../model/sandbox-configuration';
import { SandboxService } from '../../service/sandbox.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { DeleteSandboxConfigurationModalComponent } from '../../modal/delete-sandbox.modal';
import { ResetDataModalComponent } from '../../modal/reset-data.modal';
import { RdwTranslateLoader } from '../../../../shared/i18n/rdw-translate-loader';
import { SandboxStore } from '../../store/sandbox.store';

@Component({
  selector: 'sandboxes',
  templateUrl: './sandboxes.component.html'
})
export class SandboxesComponent implements OnInit {
  sandboxes$: Observable<SandboxConfiguration[]>;
  localizationDefaults$: Observable<any>;

  private _modalSubscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private service: SandboxService,
    private store: SandboxStore,
    private translationLoader: RdwTranslateLoader,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.sandboxes$ = this.store.getState();
    this.service.getAll().subscribe(sandboxes => {
      this.store.setState(sandboxes);
    });

    //TODO: Get the correct language code from somewhere, do not hardcode
    this.localizationDefaults$ = this.translationLoader.getFlattenedTranslations(
      'en'
    );
  }

  openDeleteSandboxModal(sandbox: SandboxConfiguration) {
    const modalReference: BsModalRef = this.modalService.show(
      DeleteSandboxConfigurationModalComponent
    );
    const modal: DeleteSandboxConfigurationModalComponent =
      modalReference.content;
    modal.sandbox = sandbox;
    this._modalSubscriptions.push(
      modal.deleted.subscribe(() => {
        this.store.setState(
          this.store.state.filter(({ code }) => code !== sandbox.code)
        );
      })
    );
  }

  openResetDataModal(sandbox: SandboxConfiguration) {
    const modalReference: BsModalRef = this.modalService.show(
      ResetDataModalComponent
    );
    const modal: ResetDataModalComponent = modalReference.content;
    modal.sandbox = sandbox;
    this._modalSubscriptions.push(
      modal.resetData.subscribe(sandbox => {
        console.log(sandbox);
      })
    );
  }

  ngOnDestroy(): void {
    this._modalSubscriptions.forEach(subscription =>
      subscription.unsubscribe()
    );
    this._modalSubscriptions = [];
  }
}
