/**
 * Represents a named downloaded PDF file
 */
export class ReportDownload {

  public constructor(public filename :string, public blob: Blob){}

}
