import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { IngestPipelineScript } from '../../model/script';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ScriptService } from '../../service/script.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'script',
  templateUrl: './script.component.html'
})
export class ScriptComponent implements OnInit {
  script: Observable<IngestPipelineScript>;

  constructor(
    private route: ActivatedRoute,
    private scriptService: ScriptService
  ) {}

  ngOnInit(): void {
    this.script = this.route.params.pipe(
      mergeMap(({ id }) => this.scriptService.getScript(Number(id)))
    );
  }
}
