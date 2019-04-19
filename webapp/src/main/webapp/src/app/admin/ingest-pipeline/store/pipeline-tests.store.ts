import { Injectable } from '@angular/core';
import { AbstractStore } from '../../../shared/store/abstract-store';
import { PipelineTest } from '../model/pipeline';

@Injectable({
  providedIn: 'root'
})
export class PipelineTestsStore extends AbstractStore<PipelineTest[]> {
  constructor() {
    super([]);
  }
}
