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
  showSandboxAlert: boolean; // if sandbox and user tries to upload a template

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
    this.userService
      .getUser()
      .pipe(map(user => user.sandboxUser))
      .subscribe(sandboxUser => {
        const modalReference: BsModalRef = this.modalService.show(
          IsrTemplateDeleteModal,
          {}
        );
        const modal: IsrTemplateDeleteModal = modalReference.content;
        modal.isrTemplate = rowData;
        modal.sandboxUser = sandboxUser;
        modal.deleteTemplateEvent.subscribe(res => {
          this.successfulDelete = res.data;
          this.unableToDelete = res.error;
        });

        if (this.successfulDelete) {
          // TODO: refresh template list
        }
      });
  }

  onFileSelected(event: EventEmitter<File[]>) {
    this.userService
      .getUser()
      .pipe(map(user => user.sandboxUser))
      .subscribe(sandboxUser => {
        if (sandboxUser) {
          this.showSandboxAlert = true;
        } else {
          const file: File = event[0];
          console.log(file);
        }
      });
  }

  closeErrorAlert() {
    this.unableToDelete = false;
  }

  closeSandboxAlert() {
    this.showSandboxAlert = false;
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
      this.getTemplateReportName(rowData.subject, rowData.assessmentType)
    );
  }

  getTemplateReportName(subject: string, assessmentType: string): string {
    return subject + '-' + assessmentType + '-report.html';
  }
}
