import { NgModule } from '@angular/core';
import { ReportingCommonModule } from '../shared/reporting-common.module';
import { CsvBuilder } from './csv-builder.service';
import { CsvExportService } from './csv-export.service';
import { Angular2CsvProvider } from './angular-csv.provider';
import { RdwFormatModule } from '../shared/format/rdw-format.module';

@NgModule({
  declarations: [],
  imports: [ReportingCommonModule, RdwFormatModule],
  exports: [],
  providers: [Angular2CsvProvider, CsvBuilder, CsvExportService]
})
export class CsvModule {}
