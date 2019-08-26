import {
  AbstractControl,
  AsyncValidatorFn,
  FormGroup,
  Validators
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const tenantKey = Validators.pattern(/^[a-zA-Z_]{2,}$/);

export function available(
  isAvailable: (value: string) => Observable<boolean>
): AsyncValidatorFn {
  return function(
    control: AbstractControl
  ): Observable<{ unavailable: boolean } | null> {
    return isAvailable(control.value).pipe(
      map(available => (available ? null : { unavailable: true }))
    );
  };
}

const passwordKeyPattern = /^datasources\.(\w+)\.password$/;
const auroraDatabaseNamePattern = /^datasources\.(\w+)_r[ow]\.urlParts\.database$/;
const redshiftDatabaseNamePattern = /^datasources\.(\w+)_r[ow]\.schemaSearchPath$/;

export function onePasswordPerUser(
  formGroup: FormGroup
): { onePasswordPerUser: { usernames: string[] } } | null {
  const controlNames = Object.keys(formGroup.controls);

  const passwordKeys = controlNames.filter(controlName =>
    passwordKeyPattern.test(controlName)
  );

  const passwordsByUsername: {
    [username: string]: string[];
  } = passwordKeys.reduce((byUsername, passwordKey) => {
    // assumes username of same base path for every password
    const usernameKey = `datasources.${
      passwordKeyPattern.exec(passwordKey)[1]
    }.username`;
    // this is being run on every form control addition so we need to defensively set this
    const username = (formGroup.controls[usernameKey] || <any>{}).value || '';
    const password = (formGroup.controls[passwordKey] || <any>{}).value || '';
    const passwords = byUsername[username];
    if (passwords == null) {
      byUsername[username] = [password];
    } else if (!passwords.includes(password)) {
      passwords.push(password);
    }
    return byUsername;
  }, {});

  const usernames = Object.entries(passwordsByUsername)
    .filter(([, passwords]) => passwords.length > 1)
    .map(([username]) => username);

  return usernames.length > 0 ? { onePasswordPerUser: { usernames } } : null;
}

function reduceControls(
  formGroup: FormGroup,
  pattern: RegExp,
  reducer: (result: any, key: string, value: any) => any
): [string, string[]][] {
  return Object.entries(
    Object.keys(formGroup.controls)
      .filter(key => pattern.test(key))
      .reduce(
        (result, controlName) => {
          const value = formGroup.controls[controlName].value;
          const key = pattern.exec(controlName)[1];
          reducer(result, key, value);
          return result;
        },
        <{ [key: string]: string[] }>{}
      )
  );
}

function uniqueNamesAndSources(
  formGroup: FormGroup,
  pattern: RegExp
): [string, string[]][] {
  return reduceControls(
    formGroup,
    pattern,
    (namesBySource: any, source: string, name: string) => {
      const names = namesBySource[source];
      if (names == null) {
        namesBySource[source] = [name];
      } else if (!names.includes(name)) {
        names.push(name);
      }
    }
  ).filter(([, names]) => names.length > 1);
}

function duplicateNamesAndSources(
  formGroup: FormGroup,
  pattern: RegExp
): [string, string[]][] {
  return reduceControls(
    formGroup,
    pattern,
    (sourcesByName: any, source: string, name: string) => {
      const sources = sourcesByName[name];
      if (sources == null) {
        sourcesByName[name] = [source];
      } else if (!sources.includes(source)) {
        sources.push(source);
      }
    }
  ).filter(([, sources]) => sources.length > 1);
}

export function oneDatabasePerDataSource(
  formGroup: FormGroup
): { oneDatabasePerDataSource: { conflicts: [string, string[]][] } } | null {
  const conflicts = [
    ...uniqueNamesAndSources(formGroup, auroraDatabaseNamePattern),
    ...uniqueNamesAndSources(formGroup, redshiftDatabaseNamePattern)
  ];
  return conflicts.length > 0
    ? { oneDatabasePerDataSource: { conflicts } }
    : null;
}

export function uniqueDatabasePerInstance(
  formGroup: FormGroup
): { uniqueDatabasePerInstance: { duplicates: [string, string[]][] } } | null {
  const duplicates = [
    ...duplicateNamesAndSources(formGroup, auroraDatabaseNamePattern),
    ...duplicateNamesAndSources(formGroup, redshiftDatabaseNamePattern)
  ];
  return duplicates.length > 0
    ? { uniqueDatabasePerInstance: { duplicates } }
    : null;
}
