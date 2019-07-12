import { isNullOrEmpty } from '../../shared/support/support';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AggregateReportRow } from '../../report/aggregate-report';
import { AggregateReportRequestMapper } from '../aggregate-report-request.mapper';
import { AggregateReportQueryType } from '../../report/report';
import {
  overallSubgroup,
  subgroupFromFilters,
  subgroupFromTypeAndCode,
  subgroupItemFromFilters,
  subgroupPermutationsFromFilters
} from '../../shared/support/subgroups';
import { Subgroup } from '../../shared/model/subgroup';
import { SubgroupFilters } from '../../shared/model/subgroup-filters';
import { SubgroupItem } from '../../shared/model/subgroup-item';

@Injectable()
export class SubgroupMapper {
  constructor(
    private translate: TranslateService,
    private requestMapper: AggregateReportRequestMapper
  ) {}

  createOverall(): Subgroup {
    return overallSubgroup(this.translate);
  }

  fromTypeAndCode(type: string, code: string): Subgroup {
    return subgroupFromTypeAndCode(type, code, this.translate);
  }

  fromFilters(input: SubgroupFilters, dimensionTypes?: string[]): Subgroup {
    return subgroupFromFilters(input, dimensionTypes, this.translate);
  }

  fromAggregateReportRow(
    query: AggregateReportQueryType,
    row: AggregateReportRow,
    overallFlyweight?: Subgroup
  ): Subgroup {
    if (isNullOrEmpty(query.subgroups)) {
      return this.fromTypeAndCode(row.dimension.type, row.dimension.code);
    }
    const serverSubgroup = query.subgroups[row.dimension.code];
    return serverSubgroup
      ? this.fromFilters(
          this.requestMapper.createSubgroupFilters(serverSubgroup)
        )
      : overallFlyweight || overallSubgroup(this.translate);
  }

  createPermutationsFromFilters(
    input: SubgroupFilters,
    dimensionTypes: string[]
  ): Subgroup[] {
    return subgroupPermutationsFromFilters(
      input,
      dimensionTypes,
      this.translate
    );
  }

  createItemsFromFilters(
    input: SubgroupFilters,
    dimensionTypes: string[]
  ): SubgroupItem {
    return subgroupItemFromFilters(input, dimensionTypes, this.translate);
  }
}
