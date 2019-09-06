import { reduceLanguageDimensionCodes } from './subgroups';

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

  it('should return original set of languages because the number requested was larger than the list of languages.', () => {
    expect(
      reduceLanguageDimensionCodes(smallListOfLanguages, LanguagesCode, 100)
    ).toEqual(['eng', 'chi']);
  });

  it('should have "eng" as the first element in the returned array', () => {
    expect(
      reduceLanguageDimensionCodes(allLanguages, LanguagesCode, 4)[0]
    ).toEqual('eng');
  });

  it('should have length 4', () => {
    expect(
      reduceLanguageDimensionCodes(allLanguages, LanguagesCode, 4).length
    ).toEqual(4);
  });

  it('should have length 0', () => {
    expect(
      reduceLanguageDimensionCodes(noLanguages, LanguagesCode, 4).length
    ).toEqual(0);
  });

  it('should return original array because not using the Language code', () => {
    expect(
      reduceLanguageDimensionCodes(allLanguages, NotLanguagesCode, 4)
    ).toEqual(allLanguages);
  });

  it('should return array different from the original array', () => {
    expect(
      reduceLanguageDimensionCodes(allLanguages, LanguagesCode, 4)
    ).not.toEqual(allLanguages);
  });
});
