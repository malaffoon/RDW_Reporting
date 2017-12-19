import { Component, EventEmitter, Input, Output, TemplateRef } from "@angular/core";
import { Embargo, EmbargoScope } from "./embargo";
import { Toggle } from "./toggle.component";

@Component({
  selector: 'embargo-table',
  templateUrl: './embargo-table.component.html'
})
export class EmbargoTable {

  @Input()
  translateContext: string = '';

  @Input()
  embargoes: Embargo[] = [];

  @Input()
  overridingEmbargo: Embargo;

  @Output()
  toggle: EventEmitter<EmbargoToggleEvent> = new EventEmitter<EmbargoToggleEvent>();

  // TODO later this will be provided by a service and be the codes
  subjectCodes: string[] = ['ELA', 'MATH'];

  get sortable(): boolean {
    return this.embargoes.length > 1;
  }

  toggleIndividual(toggle: Toggle, embargo: Embargo): void {
    this.toggleInternal(toggle, embargo, EmbargoScope.Individual, embargo.individualEnabled,
      this.overridingEmbargo ? this.overridingEmbargo.individualEnabled : undefined);
  }

  toggleAggregate(toggle: Toggle, embargo: Embargo): void {
    this.toggleInternal(toggle, embargo, EmbargoScope.Aggregate, embargo.aggregateEnabled,
      this.overridingEmbargo ? this.overridingEmbargo.aggregateEnabled : undefined);
  }

  private toggleInternal(toggle: Toggle, embargo: Embargo, scope: EmbargoScope, embargoEnabled: boolean, overridingEmbargoEnabled: boolean): void {
    const value = toggle.value;
    toggle.value = !value; // display fix
    if (value !== embargoEnabled) {
      this.toggle.emit({
        toggle: toggle,
        embargo: embargo,
        scope: scope,
        value: value,
        overridingEmbargo: this.overridingEmbargo,
        overridingEmbargoEnabled: overridingEmbargoEnabled
      });
    }
  }

}

export interface EmbargoToggleEvent {
  readonly toggle: Toggle;
  readonly value: boolean;
  readonly scope: EmbargoScope;
  readonly embargo: Embargo;
  readonly overridingEmbargo: Embargo;
  readonly overridingEmbargoEnabled: boolean;
}
