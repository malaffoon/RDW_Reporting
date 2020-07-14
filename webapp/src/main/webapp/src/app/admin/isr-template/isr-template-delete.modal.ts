import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { IsrTemplateService } from './service/isr-template.service';
import { IsrTemplate } from './model/isr-template';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'isr-template-delete-modal',
  templateUrl: './isr-template-delete.modal.html'
})
export class IsrTemplateDeleteModal implements OnInit {
  private _subscription: Subscription;
  public deleteTemplateEvent: EventEmitter<any> = new EventEmitter();
  isrTemplate: IsrTemplate = new IsrTemplate();

  // below determine which if any alert need to be displayed
  deleteSuccessful: boolean;
  unableToDelete: boolean;

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
    this.deleteSuccessful = false;
    this.unableToDelete = false;
  }

  cancel() {
    this.modal.hide();
  }

  delete() {
    this.isrTemplateService.delete(this.isrTemplate);
    this.deleteSuccessful = true;
    // set to true to test error alert
    this.unableToDelete = false;
    this.triggerDeleteTemplate(this.deleteSuccessful, this.unableToDelete);
    this.modal.hide();
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
