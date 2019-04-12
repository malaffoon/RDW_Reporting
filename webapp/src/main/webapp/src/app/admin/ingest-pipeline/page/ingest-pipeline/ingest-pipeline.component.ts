import { Component } from '@angular/core';
import { Script } from '../../model/script';

@Component({
  selector: 'ingest-pipeline',
  templateUrl: './ingest-pipeline.component.html'
})
export class IngestPipelineComponent {
  script: Script = {
    language: 'groovy',
    body: `
def myVar = 1

class MyClass {

}
    `
  };
}
