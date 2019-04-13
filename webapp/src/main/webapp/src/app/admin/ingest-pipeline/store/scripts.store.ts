import { AbstractStore } from '../../../shared/store/abstract-store';
import { IngestPipelineScript } from '../model/script';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScriptsStore extends AbstractStore<IngestPipelineScript[]> {
  constructor() {
    super([]);
  }
}
