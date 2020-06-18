import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../shared/notification/notification.service';
import { IsrTemplate } from './model/isr-template';
import { IsrTemplateService } from './service/isr-template.service';
import { DeleteIsrTemplateModal } from './delete-isr-template.modal';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

class Column {
  id: string; // en.json name
  field: string; // isr-template field
  sortable: boolean;

  constructor({ id, field = '', sortable = true }) {
    this.id = id;
    this.field = field ? field : id;
    this.sortable = sortable;
  }
}

@Component({
  selector: 'isr-template',
  templateUrl: './isr-template.component.html',
  styles: [
    '.configuredTemplate{ color: green }' +
      '.notConfiguredTemplate{ color: red }'
  ]
})
export class IsrTemplateComponent implements OnInit {
  columns: Column[] = [
    new Column({ id: 'subject' }),
    new Column({ id: 'assessment-type', field: 'assessmentType' }),
    new Column({ id: 'status' })
  ];

  isrTemplates: IsrTemplate[];
  // below determine which if any alert need to be displayed
  unableToDelete: boolean;
  successfulDelete: boolean;
  showSandboxAlert: boolean; // if sandbox and user tries to change status

  @ViewChild('fileDialog')
  fileDialog: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private translateService: TranslateService,
    private notificationService: NotificationService,
    private isrTemplateService: IsrTemplateService
  ) {}

  ngOnInit(): void {
    this.isrTemplates = this.isrTemplateService.getIsrTemplates();
    //this.showSandboxAlert = this.isrTemplateService.isSandbox();
  }

  getStatus(rowData: IsrTemplate) {
    return rowData.uploadedDate == null
      ? 'notConfiguredTemplate'
      : ' configuredTemplate';
  }

  showIcons(rowData) {
    return rowData.templateName != null;
  }

  openFileDialog() {
    if (this.isrTemplateService.isSandbox()) {
      //open Sandbox Modal
    }
    this.fileDialog.nativeElement.click();
  }

  onUpload($event: any) {
    if (this.isrTemplateService.isSandbox()) {
      this.showSandboxAlert = true;
    }
    console.log($event);
  }

  openDeleteTemplateModal(rowData: IsrTemplate) {
    const modalReference: BsModalRef = this.modalService.show(
      DeleteIsrTemplateModal,
      {}
    );
    const modal: DeleteIsrTemplateModal = modalReference.content;

    modal.isrTemplate = rowData;
    modal.deleteTemplateEvent.subscribe(res => {
      this.successfulDelete = res.data;
      this.unableToDelete = res.error;
    });
  }

  closeErrorAlert() {
    this.unableToDelete = false;
  }
}
