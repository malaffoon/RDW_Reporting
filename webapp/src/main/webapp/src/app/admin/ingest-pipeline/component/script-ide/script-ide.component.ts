import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IngestPipelineScript } from '../../model/script';

@Component({
  selector: 'script-ide',
  templateUrl: './script-ide.component.html',
  styleUrls: ['./script-ide.component.less']
})
export class ScriptIdeComponent {
  @Input()
  scripts: IngestPipelineScript[];

  @Input()
  selectedScript: IngestPipelineScript;

  @Output()
  scriptSelected: EventEmitter<IngestPipelineScript> = new EventEmitter();

  @Output()
  scriptUpdated: EventEmitter<IngestPipelineScript> = new EventEmitter();
}
