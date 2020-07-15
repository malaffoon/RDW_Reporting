import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../shared/notification/notification.service';
import { FileUploader } from 'ng2-file-upload';
import { IsrTemplate } from './model/isr-template';
import { IsrTemplateService } from './service/isr-template.service';
import { IsrTemplateDeleteModal } from './isr-template-delete.modal';
import { Download } from '../../shared/data/download.model';
import { saveAs } from 'file-saver';
import { UserService } from '../../shared/security/service/user.service';
import { map } from 'rxjs/operators';
import { IsrTemplateSandboxModal } from './isr-template-sandbox.modal';

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
const URL = 'http://localhost:4200/fileupload/'; // TODO: update with real info

@Component({
  selector: 'isr-template',
  templateUrl: './isr-template.component.html'
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
  isSandbox: boolean;

  fileUploader: FileUploader = new FileUploader({
    url: URL,
    disableMultipart: false,
    autoUpload: true,
    method: 'post',
    itemAlias: 'temp[ate',
    allowedFileType: ['image', 'pdf', 'html']
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private translateService: TranslateService,
    private notificationService: NotificationService,
    private isrTemplateService: IsrTemplateService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.isrTemplates = this.isrTemplateService.getIsrTemplates();
    this.unableToUpload = false;
    this.userService
      .getUser()
      .pipe(map(user => user.sandboxUser))

      .subscribe(sandboxUser => {
        this.isSandbox = sandboxUser;
      });
  }

  getStatus(rowData: IsrTemplate) {
    return rowData.uploadedDate == null
      ? 'notConfiguredTemplate'
      : 'configuredTemplate';
  }

  showIcons(rowData) {
    return rowData.templateName != null;
  }

  openDeleteTemplateModal(rowData: IsrTemplate) {
    if (this.isSandbox) {
      this.openForSandboxModal('delete');
    } else {
      const modalReference: BsModalRef = this.modalService.show(
        IsrTemplateDeleteModal,
        {}
      );
      const modal: IsrTemplateDeleteModal = modalReference.content;
      modal.isrTemplate = rowData;
      modal.deleteTemplateEvent.subscribe(res => {
        this.successfulDelete = res.data;
        this.unableToDelete = res.error;
      });

      if (this.successfulDelete) {
        // TODO: refresh template list
      }
    }
  }

  openForSandboxModal(action: string) {
    const modalReference: BsModalRef = this.modalService.show(
      IsrTemplateSandboxModal,
      {}
    );
    const modal: IsrTemplateSandboxModal = modalReference.content;
    modal.sandboxUploadMessage = action != 'delete';
  }

  onFileSelected(event: EventEmitter<File[]>) {
    const file: File = event[0];
    // TODO Save this file to it's proper location
    console.log(file);
  }

  closeErrorAlert() {
    this.unableToDelete = false;
  }

  downloadReferenceTemplate(fileName: string) {
    this.isrTemplateService.getTemplateFile().subscribe(
      (download: Download) => {
        saveAs(download.content, fileName === null ? download.name : fileName);
      },
      (error: Error) => {
        console.error(error);
      }
    );
  }

  downloadReportTemplate(rowData: IsrTemplate): void {
    this.downloadReferenceTemplate(
      this.isrTemplateService.getTemplateReportName(
        rowData.subject,
        rowData.assessmentType
      )
    );
  }

  getDownloadLabel(rowData: IsrTemplate): string {
    return (
      `${this.translateService.instant('isr-template.label-aria-download')}` +
      this.getTemplateMessage(rowData)
    );
  }

  getUploadLabel(rowData: IsrTemplate): string {
    return (
      `${this.translateService.instant('isr-template.label-aria-upload')}` +
      this.getTemplateMessage(rowData)
    );
  }

  getDeletedLabel(rowData: IsrTemplate): string {
    return (
      `${this.translateService.instant('isr-template.label-aria-delete')}` +
      this.getTemplateMessage(rowData)
    );
  }

  getTemplateMessage(rowData: IsrTemplate): string {
    return (
      rowData.subject +
      ' ' +
      rowData.assessmentType +
      `${this.translateService.instant('isr-template.label-aria-template')}`
    );
  }
}
