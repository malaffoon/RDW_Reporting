import { Component, Input, OnInit } from '@angular/core';
import { InstructionalResource } from '../../model/instructional-resource';
import { Observable } from 'rxjs';

@Component({
  selector: 'instructional-resource-popover',
  templateUrl: './instructional-resource-popover.component.html'
})
export class InstructionalResourcePopoverComponent implements OnInit {
  @Input()
  provider: () => Observable<InstructionalResource[]>;
  resources: InstructionalResource[];

  ngOnInit(): void {
    this.provider().subscribe(resources => {
      this.resources = resources;
    });
  }

  get loading(): boolean {
    return this.resources == null;
  }
}
