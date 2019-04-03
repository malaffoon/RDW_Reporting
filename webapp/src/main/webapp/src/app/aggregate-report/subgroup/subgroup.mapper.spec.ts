import { SubgroupMapper } from './subgroup.mapper';
import { TranslateService } from '@ngx-translate/core';
import { AggregateReportRequestMapper } from '../aggregate-report-request.mapper';

describe('SubgroupMapper', () => {
  let noLanguages = [];
  let allLanguages = [
    'eng',
    'spa',
    'vie',
    'chi',
    'kor',
    'fil',
    'por',
    'mnd',
    'jpn',
    'mkh',
    'lao',
    'ara',
    'arm',
    'bur',
    'dut',
    'fre',
    'ger',
    'gre',
    'cha',
    'heb',
    'hin',
    'hmn',
    'hun',
    'ilo',
    'ind',
    'ita',
    'pan',
    'rus',
    'smo',
    'tha',
    'tur',
    'ton',
    'urd',
    'ceb',
    'sgn',
    'ukr',
    'chz',
    'pus',
    'pol',
    'syr',
    'guj',
    'yao',
    'rum',
    'taw',
    'lau',
    'mah',
    'oto',
    'map',
    'kur',
    'bat',
    'toi',
    'afa',
    'alb',
    'tir',
    'som',
    'ben',
    'tel',
    'tam',
    'mar',
    'kan',
    'amh',
    'bul',
    'kik',
    'kas',
    'swe',
    'zap',
    'uzb',
    'mis',
    'per',
    'und'
  ];
  let smallListOfLanguages = ['eng', 'chi'];
  let LanguagesCode = 'Language';
  let NotLanguagesCode = 'NotLanguages';
  let translateService = jasmine.createSpyObj('TranslateService', ['instant']);
  let requestMapper = jasmine.createSpyObj('AggregateReportRequestMapper', [
    'toSettings'
  ]);
  let subgroupMapper = new SubgroupMapper(translateService, requestMapper);

  it('should return original set of languages because the number requested was larger than the list of languages.', () => {
    expect(
      subgroupMapper.reduceLanguageDimensionCodes(
        smallListOfLanguages,
        LanguagesCode,
        100
      )
    ).toEqual(['eng', 'chi']);
  });

  it('should have "eng" as the first element in the returned array', () => {
    expect(
      subgroupMapper.reduceLanguageDimensionCodes(
        allLanguages,
        LanguagesCode,
        4
      )[0]
    ).toEqual('eng');
  });

  it('should have length 4', () => {
    expect(
      subgroupMapper.reduceLanguageDimensionCodes(
        allLanguages,
        LanguagesCode,
        4
      ).length
    ).toEqual(4);
  });

  it('should have length 0', () => {
    expect(
      subgroupMapper.reduceLanguageDimensionCodes(noLanguages, LanguagesCode, 4)
        .length
    ).toEqual(0);
  });

  it('should return original array because not using the Language code', () => {
    expect(
      subgroupMapper.reduceLanguageDimensionCodes(
        allLanguages,
        NotLanguagesCode,
        4
      )
    ).toEqual(allLanguages);
  });

  it('should return array different from the original array', () => {
    expect(
      subgroupMapper.reduceLanguageDimensionCodes(
        allLanguages,
        LanguagesCode,
        4
      )
    ).not.toEqual(allLanguages);
  });
});
