import { AbstractControl, ValidationErrors } from '@angular/forms';
import { databasePassword } from './validators';

describe('databasePassword', () => {
  [
    {
      name: 'should accept cipher despite missing other criteria',
      value: '{cipher}afakljsfd',
      expectation: (x: jasmine.Matchers<ValidationErrors>) => x.toBeNull()
    },
    {
      name: 'should accept if meeting criteria',
      value: 'abCD1234$!',
      expectation: x => x.toBeNull()
    },
    {
      name: 'should not accept when missing lowercase',
      value: 'abCD1234!$'.toUpperCase(),
      expectation: x => x.toBeDefined()
    },
    {
      name: 'should not accept when missing uppercase',
      value: 'abCD1234!$'.toLowerCase(),
      expectation: x => x.toBeDefined()
    },
    {
      name: 'should not accept when missing characters',
      value: '234234231234!$',
      expectation: x => x.toBeDefined()
    },
    {
      name: 'should not accept when missing symbol',
      value: 'abCD1234',
      expectation: x => x.toBeDefined()
    },
    {
      name: 'should not accept when missing numbers',
      value: 'asfsEERWR!$',
      expectation: x => x.toBeDefined()
    },
    {
      name: 'should not accept when too short',
      value: 'aE1!',
      expectation: x => x.toBeDefined()
    },
    {
      name: 'should not accept when too long',
      value:
        'aasfasfeawqewrqwerqwasdfasfdqwerwer@#$#@ewfefsdfasfewrERWRWEFSDFWERDFSFWREWWERWRWRE1!',
      expectation: x => x.toBeDefined()
    }
  ].forEach(({ name, value, expectation }) => {
    it(name, () => {
      expectation(expect(databasePassword(<AbstractControl>{ value })));
    });
  });
});
