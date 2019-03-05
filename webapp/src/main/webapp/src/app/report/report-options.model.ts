import { PrintableReportOrder } from './report';

/**
 * Settings for shaping the content of an exam report
 */
export class ReportOptions {

  public assessmentType: string;
  public subject: string;
  public schoolYear: number;
  public language: string;
  public order: PrintableReportOrder;
  public accommodationsVisible: boolean = false;
  public name: string;
  public disableTransferAccess: boolean = false;

}
