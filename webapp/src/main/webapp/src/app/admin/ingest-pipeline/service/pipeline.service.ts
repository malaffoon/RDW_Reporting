import { Injectable } from '@angular/core';
import { DataService } from '../../../shared/data/data.service';
import { Observable } from 'rxjs';
import { IngestPipeline } from '../model/ingest-pipeline';
import { of } from 'rxjs/internal/observable/of';

const StubIngestPipelines: IngestPipeline[] = [
  {
    id: 1,
    name: 'Exam',
    description: `
    Readymade air plant direct trade flexitarian tousled,
    shabby chic hot chicken raclette pitchfork vinyl.
    Gentrify banjo live-edge, air plant vexillologist
    green juice readymade asymmetrical locavore fingerstache
    master cleanse roof party enamel pin tote bag pinterest.
    Distillery activated charcoal iceland, neutra hella small
    batch meggings single-origin coffee sustainable vaporware
    authentic mumblecore. Offal drinking vinegar bitters vegan
    tbh stumptown. Trust fund affogato plaid pickled vegan hella
    whatever brooklyn kogi seitan enamel pin. Gluten-free
    asymmetrical vape listicle.
    `,
    updatedOn: new Date(),
    updatedBy: 'Readymade air plant'
  },
  {
    id: 2,
    name: 'Assessment',
    description: `
    Hexagon blue bottle whatever plaid asymmetrical forage deep v disrupt 8-bit.
    Small batch deep v four loko helvetica, fashion axe pork belly vexillologist.
    Bicycle rights meh shoreditch try-hard, hammock typewriter fixie four loko
    shabby chic. Pour-over kitsch pinterest heirloom tousled tacos actually
    hell of vice pitchfork bushwick brunch. Ugh deep v listicle intelligentsia
    cornhole plaid vinyl typewriter umami heirloom. Church-key kitsch affogato
    mumblecore taiyaki, kale chips poke schlitz banh mi pug. Butcher dreamcatcher
    neutra woke marfa hell of before they sold out pok pok.
    `,
    updatedOn: new Date(),
    updatedBy: 'Hexagon Blue'
  }
];

@Injectable({
  providedIn: 'root'
})
export class PipelineService {
  constructor(private dataService: DataService) {}

  getIngestPipelines(): Observable<IngestPipeline[]> {
    return of(StubIngestPipelines);
  }
}
