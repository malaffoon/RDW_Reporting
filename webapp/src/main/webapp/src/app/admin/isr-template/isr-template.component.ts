import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../shared/notification/notification.service';
import { IsrTemplate } from './model/isr-template';
import { IsrTemplateService } from './service/isr-template.service';

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
      '.notConfiguredTemplate{ color: red }' +
      '.uploadTemplate{ color: green }' +
      '.downloadTemplate{ color: blue }' +
      '.deleteTemplate{ color: red }'
  ]
})
export class IsrTemplateComponent implements OnInit {
  columns: Column[] = [
    new Column({ id: 'subject' }),
    new Column({ id: 'assessment-type', field: 'assessmentType' }),
    new Column({ id: 'status' })
  ];

  isrTemplates: IsrTemplate[];
  showDelete: boolean;
  showDownload: boolean;
  @ViewChild('fileDialog')
  fileDialog: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translateService: TranslateService,
    private notificationService: NotificationService,
    private istTemplateService: IsrTemplateService
  ) {}

  ngOnInit(): void {
    this.isrTemplates = this.istTemplateService.getIsrTemplates();
    this.showDownload = true;
    this.showDelete = true;
  }

  getStatus(rowData: IsrTemplate) {
    return rowData.uploadedDate == null
      ? 'notConfiguredTemplate'
      : ' configuredTemplate';
  }

  downloadAvailable(rowData: IsrTemplate) {
    if (rowData.templateName == null) {
      console.log(
        'rowData.templateName=' +
          rowData.templateName +
          'disableDownload=' +
          this.showDownload
      );
      this.showDownload = false;
      return '{disabled: true}';
    }
    console.log('rowData.templateName=' + rowData.templateName);

    this.showDownload = true;
    return 'downloadEnabled';
  }

  getUpload() {
    return 'uploadTemplate';
  }

  openFileDialog() {
    this.fileDialog.nativeElement.click();
  }

  displayDelete(rowData: IsrTemplate) {
    if (rowData.templateName == null) {
      this.showDelete = false;
      return '{disabled: true}';
    }
    this.showDelete = false;
    return 'deleteEnabled';
  }
}
