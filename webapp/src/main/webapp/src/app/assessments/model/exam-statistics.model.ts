export class ExamStatistics {
  total: number;
  average: number;
  standardError: number;
  levels: ExamStatisticsLevel[];

  get percents(): ExamStatisticsLevel[] {
    return this.levels.map(x => {
      return {
        id: x.id,
        value: x.value / this.total * 100,
        suffix: '%'
      }
    })
  };
}

export class ExamStatisticsLevel {
  id: number;
  value: number;
  suffix: string;
}
