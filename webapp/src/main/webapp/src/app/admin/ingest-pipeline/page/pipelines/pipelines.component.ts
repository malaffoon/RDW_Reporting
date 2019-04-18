import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Pipeline } from '../../model/pipeline';
import { PipelineService } from '../../service/pipeline.service';

@Component({
  selector: 'pipelines',
  templateUrl: './pipelines.component.html',
  styleUrls: ['./pipelines.component.less']
})
export class PipelinesComponent {
  pipelines: Observable<Pipeline[]>;

  constructor(private pipelineService: PipelineService) {}

  ngOnInit(): void {
    this.pipelines = this.pipelineService.getPipelines();
  }
}
