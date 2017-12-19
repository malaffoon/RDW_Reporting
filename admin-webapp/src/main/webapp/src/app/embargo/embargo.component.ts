import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { EmbargoToggleEvent } from "./embargo-table.component";
import { EmbargoConfirmationModal } from "./embargo-confirmation-modal.component";
import { Embargo, OrganizationType } from "./embargo";

@Component({
  selector: 'embargo',
  templateUrl: './embargo.component.html'
})
export class EmbargoComponent {

  private _embargoesByOrganizationType: Map<OrganizationType, Embargo[]>;
  private _modal: BsModalRef;

  constructor(private route: ActivatedRoute,
              private modalService: BsModalService) {
  }

  ngOnInit(): void {
    this._embargoesByOrganizationType = this.route.snapshot.data[ 'embargoesByOrganizationType' ];
  }

  get embargoesByOrganizationType(): Map<OrganizationType, Embargo[]> {
    return this._embargoesByOrganizationType;
  }

  confirmToggle(event: EmbargoToggleEvent): void {
    this._modal = this.modalService.show(EmbargoConfirmationModal);
    this._modal.content.event = event;
  }

}

