import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SandboxConfiguration } from './sandbox-configuration';
import { SandboxService } from './sandbox.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { DeleteSandboxConfigurationModalComponent } from './modals/delete-sandbox.modal';
import { ArchiveSandboxConfigurationModalComponent } from './modals/archive-sandbox.modal';
import { ResetDataModalComponent } from './modals/reset-data.modal';

@Component({
  selector: 'sandbox-config',
  templateUrl: './sandbox.component.html'
})
export class SandboxConfigurationComponent {
  sandboxes: SandboxConfiguration[];

  private _modalSubscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private service: SandboxService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.service.getAll().subscribe(sandboxes => (this.sandboxes = sandboxes));
  }

  openDeleteSandboxModal(sandbox: SandboxConfiguration) {
    let modalReference: BsModalRef = this.modalService.show(
      DeleteSandboxConfigurationModalComponent
    );
    let modal: DeleteSandboxConfigurationModalComponent =
      modalReference.content;
    modal.sandbox = sandbox;
    this._modalSubscriptions.push(
      modal.deleted.subscribe(sandbox => {
        console.log(sandbox);
      })
    );
    this._modalSubscriptions.push(
      this.modalService.onHidden.subscribe(() => {
        this.unsubscribe();
      })
    );
  }

  openArchiveSandboxModal(sandbox: SandboxConfiguration) {
    let modalReference: BsModalRef = this.modalService.show(
      ArchiveSandboxConfigurationModalComponent
    );
    let modal: ArchiveSandboxConfigurationModalComponent =
      modalReference.content;
    modal.sandbox = sandbox;
    this._modalSubscriptions.push(
      modal.archived.subscribe(sandbox => {
        console.log(sandbox);
      })
    );
    this._modalSubscriptions.push(
      this.modalService.onHidden.subscribe(() => {
        this.unsubscribe();
      })
    );
  }

  openResetDataModal(sandbox: SandboxConfiguration) {
    let modalReference: BsModalRef = this.modalService.show(
      ResetDataModalComponent
    );
    let modal: ResetDataModalComponent = modalReference.content;
    modal.sandbox = sandbox;
    this._modalSubscriptions.push(
      modal.resetData.subscribe(sandbox => {
        console.log(sandbox);
      })
    );
    this._modalSubscriptions.push(
      this.modalService.onHidden.subscribe(() => {
        this.unsubscribe();
      })
    );
  }

  unsubscribe() {
    this._modalSubscriptions.forEach(subscription =>
      subscription.unsubscribe()
    );
    this._modalSubscriptions = [];
  }
}
