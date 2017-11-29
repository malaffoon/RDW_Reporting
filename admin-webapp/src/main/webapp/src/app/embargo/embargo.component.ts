import { Component } from "@angular/core";
import { EmbargoService } from "./embargo.service";
import { ActivatedRoute } from "@angular/router";
import { Embargo, EmbargoSettings } from "./embargo-settings";

@Component({
  selector: 'embargo',
  templateUrl: './embargo.component.html'
})
export class EmbargoComponent {

  private _embargoes: EmbargoSettings;

  constructor(private route: ActivatedRoute,
              private embargoService: EmbargoService){
  }

  ngOnInit(): void {
    this._embargoes = this.route.snapshot.data[ 'embargoes' ];
  }

  get embargoes(): EmbargoSettings {
    return this._embargoes;
  }

  change(event: any): void {
    console.log('change', event);
  }

  toggleEmbargo(embargo: Embargo): void {
    this.embargoService.toggleEmbargo(embargo);
  }

}
