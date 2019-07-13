import { Component, Input } from '@angular/core';
import { Subgroup } from '../../shared/model/subgroup';

@Component({
  selector: 'subgroup',
  templateUrl: './subgroup.component.html'
})
export class SubgroupComponent {
  @Input()
  subgroup: Subgroup;
}
