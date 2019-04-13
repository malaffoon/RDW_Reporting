import { Component, OnInit } from '@angular/core';
import { IngestPipelineScript } from '../../model/script';
import { ScriptService } from '../../service/script.service';
import { byNumber } from '@kourge/ordering/comparator';
import { ordering } from '@kourge/ordering';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ScriptsStore } from '../../store/scripts.store';

@Component({
  selector: 'scripts-page',
  templateUrl: './scripts-page.component.html'
})
export class ScriptsPageComponent implements OnInit {
  activeScripts: Observable<IngestPipelineScript[]>;
  inactiveScripts: Observable<IngestPipelineScript[]>;

  constructor(
    private ingestPipelineService: ScriptService,
    private ingestPipelineScriptStore: ScriptsStore
  ) {}

  ngOnInit(): void {
    this.activeScripts = this.ingestPipelineScriptStore
      .getState()
      .pipe(
        map(scripts =>
          scripts
            .filter(({ index }) => index != null)
            .sort(ordering(byNumber).on(({ index }) => index).compare)
        )
      );

    this.inactiveScripts = this.ingestPipelineScriptStore
      .getState()
      .pipe(
        map(scripts =>
          scripts
            .filter(({ index }) => index == null)
            .sort(ordering(byNumber).on(({ id }) => id).compare)
        )
      );

    this.ingestPipelineService.getScripts().subscribe(scripts => {
      this.ingestPipelineScriptStore.setState(scripts);
    });
  }
}
