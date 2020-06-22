import { Injectable } from '@angular/core';
import { TranslateDatePipe } from '../../../shared/i18n/translate-date.pipe';
import { IsrTemplate } from '../model/isr-template';
import { Observable } from 'rxjs';

@Injectable()
export class IsrTemplateService {
  sandbox = false; // TODO: set from session info

  constructor(private datePipe: TranslateDatePipe) {}

  formatAsLocalDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd hh:mm');
  }

  getNotConfigured(): string {
    return '✕ Not Configured';
  }

  getConfigured(date: Date): string {
    return '✓ Uploaded ' + this.formatAsLocalDate(date);
  }

  delete(isrTemplate: IsrTemplate): Observable<any> {
    console.log('Deleted template: ' + isrTemplate.templateName);
    return new Observable<any>();
  }

  // todo update with real data
  getIsrTemplates(): IsrTemplate[] {
    return [
      {
        subject: 'ELA',
        assessmentType: 'IAB',
        status: this.getConfigured(new Date('Jan 4, 2020 13:45')),
        templateName: 'ISRTemplate-IAB-ELA',
        location: './',
        uploadedDate: new Date('Jan 4, 2020')
      },
      {
        subject: 'ELA',
        assessmentType: 'ICA',
        status: this.getConfigured(new Date('Feb 4, 2020 09:23')),
        templateName: 'template-ICA-ELA',
        location: './',
        uploadedDate: new Date('Feb 4, 2020')
      },
      {
        subject: 'ELA',
        assessmentType: 'Summative',
        status: this.getConfigured(new Date('Mar 10, 2020 11:07')),
        templateName: 'template-summative-ELA',
        location: './',
        uploadedDate: new Date('Mar 10, 2020')
      },
      {
        subject: 'ELPAC',
        assessmentType: 'Summative',
        status: this.getNotConfigured(),
        templateName: null,
        location: null,
        uploadedDate: null
      },
      {
        subject: 'Math',
        assessmentType: 'IAB',
        status: this.getConfigured(new Date('Jan 4, 2020 13:46')),
        templateName: 'template-IAB-Math',
        location: './templates/',
        uploadedDate: new Date('Jan 4, 2020')
      },
      {
        subject: 'Math',
        assessmentType: 'ICA',
        status: this.getNotConfigured(),
        templateName: null,
        location: null,
        uploadedDate: null
      },
      {
        subject: 'Math',
        assessmentType: 'Summative',
        status: this.getConfigured(new Date('June 4, 2020 18:19')),
        templateName: 'template-summative-math',
        location: './',
        uploadedDate: new Date('June 4, 2020')
      }
    ];
  }
}
