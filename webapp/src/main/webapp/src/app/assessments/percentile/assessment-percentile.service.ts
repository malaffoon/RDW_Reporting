import { Injectable } from "@angular/core";
import { DataService } from "../../shared/data/data.service";
import { Observable } from "rxjs/Observable";
import { Percentile, PercentileGroup } from "./assessment-percentile";
import { DatePipe } from "@angular/common";
import { map } from "rxjs/operators";
import * as _ from "lodash";
import { ReportingServiceRoute } from "../../shared/service-route";

@Injectable()
export class AssessmentPercentileService {

  constructor(private dataService: DataService,
              private datePipe: DatePipe) {
  }

  getPercentiles(request: AssessmentPercentileRequest): Observable<Percentile[]> {
    return this.dataService
      .get(`${ReportingServiceRoute}/assessment-percentiles`, {
        params: this.toServerRequest(request)
      });
  }

  getPercentilesGroupedByRank(request: AssessmentPercentileRequest): Observable<PercentileGroup[]> {
    return this.getPercentiles(request).pipe(map(percentiles => {
      if (percentiles.length == 0) {
        return [];
      }
      const groups: PercentileGroup[] = [];
      for (let i = 0; i < percentiles.length; i++) {
        const previousGroup = groups[ groups.length - 1 ];
        const percentile = percentiles[ i ];
        const percentileRanks = percentile.scores.map(score => score.rank);
        if (groups.length === 0
          || !_.isEqual(previousGroup.ranks, percentileRanks)) {
          groups.push({
            ranks: percentileRanks,
            percentiles: [ percentile ]
          })
        } else {
          previousGroup.percentiles.push(percentile);
        }
      }
      return groups;
    }));
  }

  private toServerRequest(request: AssessmentPercentileRequest): AssessmentPercentileServerRequest {
    return {
      assessmentId: request.assessmentId,
      startDate: this.formatAsLocalDate(request.from),
      endDate: this.formatAsLocalDate(request.to)
    };
  }

  private formatAsLocalDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

}

export interface AssessmentPercentileRequest {
  assessmentId: number;
  from: Date;
  to: Date;
}

interface AssessmentPercentileServerRequest {
  assessmentId: number;
  startDate: string;
  endDate: string;
}
