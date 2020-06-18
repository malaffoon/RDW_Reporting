import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../shared/notification/notification.service';
import { IsrTemplate } from './model/isr-template';
import { IsrTemplateService } from './service/isr-template.service';
import { IsrTemplateDeleteModal } from './isr-template-delete.modal';

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
  unableToUpload: boolean;
  showSandboxAlert: boolean; // if sandbox and user tries to upload a template

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
    this.unableToUpload = false;
  }

  getStatus(rowData: IsrTemplate) {
    return rowData.uploadedDate == null
      ? 'notConfiguredTemplate'
      : 'configuredTemplate';
  }

  showIcons(rowData) {
    return rowData.templateName != null;
  }

  openFileDialog() {
    if (this.isrTemplateService.sandbox) {
      // open Sandbox alert
      this.showSandboxAlert = true;
    } else {
      this.fileDialog.nativeElement.click();
    }
  }

  onUpload($event: any) {
    if (this.isrTemplateService.sandbox) {
      this.showSandboxAlert = true;
    }
    console.log($event);
  }

  openDeleteTemplateModal(rowData: IsrTemplate) {
    let modalReference: BsModalRef = this.modalService.show(
      IsrTemplateDeleteModal,
      {}
    );
    let modal: IsrTemplateDeleteModal = modalReference.content;
    modal.isrTemplate = rowData;

    modal.deleteTemplateEvent.subscribe(res => {
      this.successfulDelete = res.data;
      this.unableToDelete = res.error;
    });

    if (this.successfulDelete) {
      // todo refresh template list
    }
  }

  closeErrorAlert() {
    this.unableToDelete = false;
  }

  closeSandboxAlert() {
    this.showSandboxAlert = false;
  }
}
