import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { isNullOrBlank } from '../../../../shared/support/support';
import { notBlank, renameError } from '../../../../shared/form/validators';

// requires a scheme
const uriPattern = Validators.pattern(/^.+:\/\/.+$/);
// can be a fragment
const urlFragmentPattern = Validators.pattern(/^(\/|\w+:\/\/).+$/);
const archiveUriPattern = Validators.pattern(/^(file|s3):\/\/.+$/);
const databasePasswordPattern = Validators.compose([
  Validators.minLength(8),
  Validators.maxLength(64),
  Validators.pattern(
    '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z].{8,}|^{cipher}.+'
  )
]);

const postgresReservedWords = [
  'ALL',
  'ANALYSE',
  'ANALYZE',
  'AND',
  'ANY',
  'ARRAY',
  'AS',
  'ASC',
  'ASYMMETRIC',
  'AUTHORIZATION',
  'BINARY',
  'BOTH',
  'CASE',
  'CAST',
  'CHECK',
  'COLLATE',
  'COLLATION',
  'COLUMN',
  'CONCURRENTLY',
  'CONSTRAINT',
  'CREATE',
  'CROSS',
  'CURRENT_CATALOG',
  'CURRENT_DATE',
  'CURRENT_ROLE',
  'CURRENT_SCHEMA',
  'CURRENT_TIME',
  'CURRENT_TIMESTAMP',
  'CURRENT_USER',
  'DEFAULT',
  'DEFERRABLE',
  'DESC',
  'DISTINCT',
  'DO',
  'ELSE',
  'END',
  'EXCEPT',
  'FALSE',
  'FETCH',
  'FOR',
  'FOREIGN',
  'FREEZE',
  'FROM',
  'FULL',
  'GRANT',
  'GROUP',
  'HAVING',
  'ILIKE',
  'IN',
  'INITIALLY',
  'INNER',
  'INTERSECT',
  'INTO',
  'IS',
  'ISNULL',
  'JOIN',
  'LATERAL',
  'LEADING',
  'LEFT',
  'LIKE',
  'LIMIT',
  'LOCALTIME',
  'LOCALTIMESTAMP',
  'NATURAL',
  'NOT',
  'NOTNULL',
  'NULL',
  'OFFSET',
  'ON',
  'ONLY',
  'OR',
  'ORDER',
  'OUTER',
  'OVERLAPS',
  'PLACING',
  'PRIMARY',
  'REFERENCES',
  'RETURNING',
  'RIGHT',
  'SELECT',
  'SESSION_USER',
  'SIMILAR',
  'SOME',
  'SYMMETRIC',
  'TABLE',
  'TABLESAMPLE',
  'THEN',
  'TO',
  'TRAILING',
  'TRUE',
  'UNION',
  'UNIQUE',
  'USER',
  'USING',
  'VARIADIC',
  'VERBOSE',
  'WHEN',
  'WHERE',
  'WINDOW',
  'WITH'
];

export function notPostgresReservedWord(
  control: AbstractControl
): { reservedWord: string } | null {
  const trimmedValue = (control.value || '').trim().toUpperCase();
  const reservedWord = postgresReservedWords.find(
    word => word === trimmedValue
  );
  return reservedWord != null ? { reservedWord } : null;
}

export function uri(control: AbstractControl): { uri: boolean } {
  return uriPattern(control) != null ? { uri: true } : null;
}

export function urlFragment(
  control: AbstractControl
): { urlFragment: boolean } {
  return urlFragmentPattern(control) != null ? { urlFragment: true } : null;
}

export function archiveUri(control: AbstractControl): { archiveUri: boolean } {
  return archiveUriPattern(control) != null ? { archiveUri: true } : null;
}

export function databasePassword(
  control: AbstractControl
): { databasePassword: boolean } {
  return databasePasswordPattern(control) != null
    ? { databasePassword: true }
    : null;
}

export function requiredList(
  control: AbstractControl
): { required: boolean } | null {
  return control.value != null && control.value.length > 0
    ? null
    : { required: true };
}

const touchOptions = { onlySelf: true, emitEvent: false };

// used to prevent stack overflow
let recursionCount = 0;

export function requiredIfOthersPresent(
  keys: string[],
  errorName: string = 'required'
): ValidatorFn {
  return function(control: AbstractControl): ValidationErrors {
    const value = control.value;
    const formGroup = control.parent as FormGroup;
    if (formGroup == null) {
      return null;
    }

    // only do this for the first two controls in the chain
    if (recursionCount++ === 0) {
      // touch other fields
      keys.forEach(key => {
        const control = formGroup.controls[key];
        // causes recursion and there is no way to check if it was touched this frame already without the recursion counter
        control.markAsTouched(touchOptions);
        control.updateValueAndValidity(touchOptions);
      });
    } else {
      // don't touch fields and reset counter so next invocation touches fields
      recursionCount = 0;
    }

    return isNullOrBlank(value) &&
      keys.some(key => !isNullOrBlank(formGroup.controls[key].value))
      ? { [errorName]: true }
      : null;
  };
}

const s3ArchiveProperties = [
  's3AccessKey',
  's3RegionStatic',
  's3SecretKey',
  's3Sse'
];
const requiredS3ArchiveProperties = [
  's3AccessKey',
  's3RegionStatic',
  's3SecretKey',
  'uriRoot'
];
const archivePattern = /^(.*\.)uriRoot$/;
const s3SchemePattern = /^s3:\/\/.+$/;

export function archives(formGroup: FormGroup): ValidationErrors {
  // for each archive config
  Object.keys(formGroup.controls)
    .filter(key => archivePattern.test(key))
    .map(key => archivePattern.exec(key)[1])
    .forEach(prefix => {
      // if s3 field is filled OR uriRoot is s3 scheme
      // then the rest of the required s3 fields are required
      // also the uriRoot field is required to start with s3://
      if (
        s3SchemePattern.test(formGroup.getRawValue()[prefix + 'uriRoot']) ||
        s3ArchiveProperties
          .map(property => formGroup.getRawValue()[prefix + property])
          .some(value => !isNullOrBlank(value))
      ) {
        requiredS3ArchiveProperties
          .map(property => ({
            property,
            control: formGroup.controls[prefix + property]
          }))
          .forEach(({ property, control }) => {
            if (property === 'uriRoot') {
              control.setValidators([
                notBlank,
                renameError(Validators.pattern(s3SchemePattern), 's3scheme')
              ]);
            } else {
              control.setValidators(notBlank);
            }
            control.markAsTouched(touchOptions);
            control.updateValueAndValidity(touchOptions);
          });
      } else {
        requiredS3ArchiveProperties
          .map(property => ({
            property,
            control: formGroup.controls[prefix + property]
          }))
          .forEach(({ property, control }) => {
            if (property === 'uriRoot') {
              control.setValidators([archiveUri]);
            } else {
              control.clearValidators();
            }
            control.markAsTouched(touchOptions);
            control.updateValueAndValidity(touchOptions);
          });
      }
    });
  return null;
}
