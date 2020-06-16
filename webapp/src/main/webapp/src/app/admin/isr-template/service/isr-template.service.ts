import { Injectable } from '@angular/core';
import { TranslateDatePipe } from '../../../shared/i18n/translate-date.pipe';
import { IsrTemplate } from '../model/isr-template';

@Injectable()
export class IsrTemplateService {
  constructor(private datePipe: TranslateDatePipe) {}

  formatAsLocalDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  getNotConfigured(): string {
    return '✕ Not Configured';
  }

  getConfigured(date: Date): string {
    return '✓ Uploaded ' + this.formatAsLocalDate(date);
  }

  // todo update with real data
  getIsrTemplates(): IsrTemplate[] {
    return [
      {
        assessmentType: 'IAB',
        subject: 'ELA',
        status: this.getConfigured(new Date('Jan 4, 2020')),
        templateName: 'ISRTemplate-IAB-ELA',
        location: './',
        uploadedDate: new Date('Jan 4, 2020')
      },
      {
        assessmentType: 'IAB',
        subject: 'Math',
        status: this.getConfigured(new Date('Jan 4, 2020')),
        templateName: 'template-IAB-Math',
        location: './templates/',
        uploadedDate: new Date('Jan 4, 2020')
      },
      {
        assessmentType: 'ICA',
        subject: 'ELA',
        status: this.getConfigured(new Date('Feb 4, 2020')),
        templateName: 'template-ICA-ELA',
        location: './',
        uploadedDate: new Date('Feb 4, 2020')
      },
      {
        assessmentType: 'ICA',
        subject: 'Math',
        status: this.getNotConfigured(),
        templateName: null,
        location: null,
        uploadedDate: null
      },
      {
        assessmentType: 'Summative',
        subject: 'ELA',
        status: this.getConfigured(new Date('Mar 10, 2020')),
        templateName: 'template-summative-ELA',
        location: './',
        uploadedDate: new Date('Mar 10, 2020')
      },
      {
        assessmentType: 'Summative',
        subject: 'ELPAC',
        status: this.getNotConfigured(),
        templateName: null,
        location: null,
        uploadedDate: null
      },
      {
        assessmentType: 'Summative',
        subject: 'Math',
        status: this.getConfigured(new Date('June 4, 2020')),
        templateName: 'template-summative-math',
        location: './',
        uploadedDate: new Date('June 4, 2020')
      }
    ];
  }
}
