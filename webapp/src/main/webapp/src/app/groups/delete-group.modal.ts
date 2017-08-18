import { BsModalRef } from "ngx-bootstrap";
import { Component } from "@angular/core";
import { Group } from "./model/group.model";
import { GroupService } from "./groups.service";

@Component({
  selector: 'set-active-modal',
  templateUrl: './delete-group.modal.html'
})
export class DeleteGroupModalComponent {
  group: Group;
  unableToDelete: boolean = false;

  constructor(private bsModalRef: BsModalRef, private service: GroupService) {
  }

  cancel() {
    this.bsModalRef.hide();
  }

  save() {
    this.service.delete(this.group).subscribe(res => {
      this.bsModalRef.hide();
    }, (error) => {
      this.unableToDelete = true;
    });
  }
}
