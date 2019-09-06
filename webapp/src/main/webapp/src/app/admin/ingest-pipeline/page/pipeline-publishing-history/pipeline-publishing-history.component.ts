import { Component } from '@angular/core';
import { BehaviorSubject, Observable, pipe } from 'rxjs';
import { Pipeline, PublishedPipeline } from '../../model/pipeline';
import { PipelineService } from '../../service/pipeline.service';
import { ActivatedRoute, Router } from '@angular/router';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { map } from 'rxjs/operators';
import { tap } from 'rxjs/internal/operators/tap';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ConfirmationModalComponent } from '../../../../shared/component/confirmation-modal/confirmation-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { ordering } from '@kourge/ordering';
import { byDate } from '@kourge/ordering/comparator';

@Component({
  selector: 'pipeline-publishing-history',
  templateUrl: './pipeline-publishing-history.component.html'
})
export class PipelinePublishingHistoryComponent {
  pipeline: BehaviorSubject<Pipeline> = new BehaviorSubject(undefined);
  pipelines: Observable<PublishedPipeline[]>;
  selectedPipeline: PublishedPipeline;

  constructor(
    private pipelineService: PipelineService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    const pipelineId = this.route.params.pipe(map(({ id }) => Number(id)));
    this.pipelines = this.pipeline.pipe(
      mergeMap(pipeline =>
        this.pipelineService.getPublishedPipelines(pipeline.code).pipe(
          map(values =>
            (values || []).slice().sort(
              ordering(byDate)
                .on(({ publishedOn }) => publishedOn)
                .reverse().compare
            )
          )
        )
      ),
      tap(pipelines => {
        // select again the selected pipeline
        this.onPipelineSelect(
          this.selectedPipeline != null
            ? pipelines.find(
                ({ version }) => version === this.selectedPipeline.version
              )
            : pipelines[0]
        );
      })
    );

    pipelineId
      .pipe(mergeMap(id => this.pipelineService.getPipeline(id)))
      .subscribe(value => this.pipeline.next(value));
  }

  onPipelineSelect(pipeline: PublishedPipeline): void {
    this.pipelineService
      .getPublishedPipeline(pipeline.pipelineCode, pipeline.version)
      .subscribe(published => {
        this.selectedPipeline = published;
      });
  }

  onPipelineActivate(pipeline: Pipeline): void {
    this.openUpdatePipelineModal('activate-pipeline-modal', pipeline);
  }

  onPipelineDeactivate(pipeline: Pipeline): void {
    this.openUpdatePipelineModal('deactivate-pipeline-modal', pipeline);
  }

  private openUpdatePipelineModal(
    messageNamespace: string,
    pipeline: Pipeline
  ): void {
    const messageContext = {
      pipelineName: this.translateService.instant(
        `ingest-pipeline.${pipeline.code}.name`
      ),
      pipelineVersion: pipeline.activeVersion
    };
    const modalReference: BsModalRef = this.modalService.show(
      ConfirmationModalComponent
    );
    const modal: ConfirmationModalComponent = modalReference.content;
    modal.head = this.translateService.instant(
      `${messageNamespace}.head`,
      messageContext
    );
    modal.body = this.translateService.instant(
      `${messageNamespace}.body`,
      messageContext
    );
    modal.acceptButton = this.translateService.instant(
      `${messageNamespace}.accept`
    );
    modal.accept.subscribe(() => {
      this.pipelineService.updatePipeline(pipeline).subscribe(value => {
        this.pipeline.next(value);
      });
    });
  }
}
