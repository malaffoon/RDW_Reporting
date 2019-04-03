import { Utils } from '../support/support';
import { ReportingEmbargoService } from './reporting-embargo.service';
import { AggregateEmbargoService } from './aggregate-embargo.service';

export class EmbargoAlert {
  private _showAlert: boolean;

  constructor(
    private service: ReportingEmbargoService | AggregateEmbargoService
  ) {}

  get showAlert(): boolean {
    return this._showAlert;
  }

  ngOnInit(): void {
    if (Utils.isNullOrUndefined(this._showAlert)) {
      this.service
        .isEmbargoed()
        .subscribe(embargoed => (this._showAlert = embargoed));
    }
  }
}
