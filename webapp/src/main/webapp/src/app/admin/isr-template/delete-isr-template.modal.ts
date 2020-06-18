import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { IsrTemplateService } from './service/isr-template.service';
import { IsrTemplate } from './model/isr-template';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'delete-isr-template-modal',
  templateUrl: './delete-isr-template.modal.html'
})
export class DeleteIsrTemplateModal implements OnInit {
  private _subscription: Subscription;
  public deleteTemplateEvent: EventEmitter<any> = new EventEmitter();
  isrTemplate: IsrTemplate = new IsrTemplate();

  // below determine which if any alert need to be displayed
  deleteSuccessful: boolean;
  unableToDelete: boolean;
  showSandboxAlert: boolean; // if sandbox and user tries to change status
  constructor(
    private modal: BsModalRef,
    private isrTemplateService: IsrTemplateService,
    private router: Router
  ) {
    this._subscription = router.events
      .pipe(filter(e => e instanceof NavigationStart))
      .subscribe(() => {
        this.cancel();
      });
  }

  ngOnInit(): void {
    this.showSandboxAlert = false;
    this.deleteSuccessful = false;
    this.unableToDelete = false;
  }

  cancel() {
    this.modal.hide();
  }

  delete() {
    console.log(this.isrTemplate);
    if (this.isrTemplateService.isSandbox()) {
      // is a sandbox, do not allow and actual test results status changes
      // keep modal up to display message to user
      this.showSandboxAlert = true;
    } else {
      this.isrTemplateService.delete(this.isrTemplate);
      this.deleteSuccessful = true;
      // set to true to test alert
      this.unableToDelete = true;
    }
    this.triggerDeleteTemplate(this.deleteSuccessful, this.unableToDelete);
  }

  private triggerDeleteTemplate(
    deleteSuccessful: boolean,
    unableToChange: boolean
  ) {
    this.deleteTemplateEvent.emit({
      data: deleteSuccessful,
      res: 200,
      error: unableToChange
    });
  }
}
