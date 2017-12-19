import { Component } from "@angular/core";
import { EmbargoToggleEvent } from "./embargo-table.component";
import { BsModalRef } from "ngx-bootstrap";
import { EmbargoScope, OrganizationType } from "./embargo";
import { EmbargoService } from "./embargo.service";

@Component({
  selector: 'embargo-confirmation-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title pull-left">{{content.header | translate: content.parameters}}</h4>
      <button type="button" class="close pull-right" aria-label="Close" (click)="modal.hide()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p>{{content.stateDescription | translate: content.parameters}}</p>
      <p>{{content.commandDescription | translate: content.parameters}}</p>
    </div>
    <div class="modal-footer">
      <div class="pull-right">
        <button class="btn btn-xs btn-default" (click)="modal.hide()">{{content.decline | translate: content.parameters}}</button>
        <button class="btn btn-xs btn-primary" (click)="accept()">{{content.accept | translate: content.parameters}}
        </button>
      </div>
    </div>
  `
})
export class EmbargoConfirmationModal {

  content: EmbargoConfirmationModalContent = <EmbargoConfirmationModalContent>{};
  private translateContext: string = 'labels.embargo.modal';
  private _event: EmbargoToggleEvent;

  constructor(public modal: BsModalRef,
              private embargoService: EmbargoService) {
  }

  get event(): EmbargoToggleEvent {
    return this._event;
  }

  set event(event: EmbargoToggleEvent) {
    this._event = event;
    this.content = this.createContent(event);
  }

  accept() {
    const { embargo, scope, value, toggle } = this.event;
    this.embargoService.update(embargo, scope, value)
      .subscribe(() => {
        if (scope === EmbargoScope.Individual) {
          embargo.individualEnabled = value;
        } else {
          embargo.aggregateEnabled = value;
        }
        toggle.value = value;
        this.modal.hide();
      });
  }

  private createContent(event: EmbargoToggleEvent): EmbargoConfirmationModalContent {

    const [ stateEmbargo, stateEnabled ] = event.embargo.organization.type === OrganizationType.State
      ? [ event.embargo, event.value ]
      : [ event.overridingEmbargo, event.overridingEmbargoEnabled ];

    return {
      header: `${this.translateContext}.header.${event.scope}`,
      stateDescription: `${this.translateContext}.state-description.${event.scope}.State-${stateEnabled}`,
      commandDescription: event.embargo.organization.type === OrganizationType.State
        ? `${this.translateContext}.command-description.${event.embargo.organization.type}.${event.scope}.State-${stateEnabled}`
        : `${this.translateContext}.command-description.${event.embargo.organization.type}.${event.scope}.State-${stateEnabled}.District-${event.value}`,
      accept: `${this.translateContext}.accept.${event.embargo.organization.type}.${event.value}`,
      decline: `${this.translateContext}.decline`,
      parameters: {
        stateName: stateEmbargo.organization.name,
        organizationName: event.embargo.organization.name,
        resultCount: Object.keys(event.embargo.examCountsBySubject)
          .reduce((count, key) => count + event.embargo.examCountsBySubject[ key ], 0)
      }
    };
  }

}

export class EmbargoConfirmationModalContent {

  header?: string;
  stateDescription?: string;
  commandDescription?: string;
  accept?: string;
  decline?: string;
  parameters?: any;

}
