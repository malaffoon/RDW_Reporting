import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { EmbargoSettings } from "./embargo-settings";

@Component({
  selector: 'embargo',
  templateUrl: './embargo.component.html'
})
export class EmbargoComponent {

  private _embargoes: EmbargoSettings;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this._embargoes = this.route.snapshot.data[ 'embargoes' ];
  }

  get embargoes(): EmbargoSettings {
    return this._embargoes;
  }

}
