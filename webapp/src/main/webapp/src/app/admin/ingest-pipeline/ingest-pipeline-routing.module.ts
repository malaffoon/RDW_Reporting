import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ingestPipelineRoutes } from './ingest-pipeline.routes';

@NgModule({
  imports: [RouterModule.forChild(ingestPipelineRoutes)],
  exports: [RouterModule]
})
export class IngestPipelineRoutingModule {}
