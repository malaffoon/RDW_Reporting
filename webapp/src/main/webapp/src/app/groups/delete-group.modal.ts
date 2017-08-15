import { BsModalRef } from "ngx-bootstrap";
import { Component } from "@angular/core";
import { Group } from "./model/group.model";

@Component({
  selector: 'set-active-modal',
  templateUrl: './delete-group.modal.html'
})
export class DeleteGroupModalComponent {
  public group: Group;

  constructor(public bsModalRef: BsModalRef) {
  }

  cancel() {
    this.bsModalRef.hide();
  }

  save() {
    console.log("Make api call to deactivate group.");
    this.bsModalRef.hide();
  }
}
