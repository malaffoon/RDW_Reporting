export interface CsvColumn {
  label: string;
  dataProvider: (item: any) => any;
}
