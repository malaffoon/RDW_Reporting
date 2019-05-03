import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SandboxConfiguration } from '../model/sandbox-configuration';
import { SandboxService } from '../service/sandbox.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { DeleteTenantOrSandboxConfigurationModalComponent } from '../modal/delete-tenant-or-sandbox.modal';
import { ArchiveSandboxConfigurationModalComponent } from '../modal/archive-sandbox.modal';
import { ResetDataModalComponent } from '../modal/reset-data.modal';

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
      DeleteTenantOrSandboxConfigurationModalComponent
    );
    let modal: DeleteTenantOrSandboxConfigurationModalComponent =
      modalReference.content;
    modal.sandboxOrTenant = sandbox;
    this._modalSubscriptions.push(
      modal.deleted.subscribe(sandbox => {
        console.log(sandbox);
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
  }

  unsubscribe() {
    this._modalSubscriptions.forEach(subscription =>
      subscription.unsubscribe()
    );
    this._modalSubscriptions = [];
  }
}
