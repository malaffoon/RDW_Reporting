import { Injectable } from '@angular/core';
import { AssessmentExporter } from '../../assessments/assessment-exporter.interface';
import { ExportItemsRequest } from '../../assessments/model/export-items-request.model';
import { ExportWritingTraitsRequest } from '../../assessments/model/export-writing-trait-request.model';
import { ExportRequest } from '../../assessments/model/export-request.interface';
import { Assessment } from '../../assessments/model/assessment';
import { Angulartics2 } from 'angulartics2';
import { CsvExportService } from '../../csv-export/csv-export.service';
import { TranslateService } from '@ngx-translate/core';
import { Grade } from '../grade.model';
import { ExportTargetReportRequest } from '../../assessments/model/export-target-report-request.model';

@Injectable()
export class SchoolAssessmentExportService implements AssessmentExporter {
  schoolId: number;
  schoolName: string;
  grade: Grade;
  schoolYear: number;

  constructor(
    private csvExportService: CsvExportService,
    private angulartics2: Angulartics2,
    private translate: TranslateService
  ) {}

  exportItemsToCsv(exportRequest: ExportItemsRequest) {
    const filename: string = this.getFilename(exportRequest);

    this.angulartics2.eventTrack.next({
      action: 'Export School/Grade Results by Items',
      properties: {
        category: 'Export'
      }
    });

    this.csvExportService.exportResultItems(exportRequest, filename);
  }

  exportWritingTraitScoresToCsv(exportRequest: ExportWritingTraitsRequest) {
    const filename: string = this.getFilename(exportRequest);

    this.angulartics2.eventTrack.next({
      action: 'Export School/Grade Trait Scores',
      properties: {
        category: 'Export'
      }
    });

    this.csvExportService.exportWritingTraitScores(exportRequest, filename);
  }

  exportTargetScoresToCsv(exportRequest: ExportTargetReportRequest) {
    const filename: string = this.getFilename(exportRequest);

    this.angulartics2.eventTrack.next({
      action: 'Export School/Grade Target Report Scores',
      properties: {
        category: 'Export'
      }
    });

    this.csvExportService.exportTargetScoresToCsv(exportRequest, filename);
  }

  private getFilename(exportRequest: ExportRequest) {
    const assessment: Assessment = exportRequest.assessment;
    return (
      this.schoolName +
      '-' +
      this.translate.instant(
        `common.assessment-grade-short-label.${this.grade.code}`
      ) +
      '-' +
      assessment.label +
      '-' +
      this.translate.instant(exportRequest.type.toString()) +
      '-' +
      new Date().toDateString()
    );
  }
}
