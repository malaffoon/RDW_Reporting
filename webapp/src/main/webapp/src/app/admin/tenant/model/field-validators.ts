import { AbstractControl, Validators } from '@angular/forms';

// requires a scheme
export const uri = Validators.pattern(/^.+:\/\/.+$/);

// can be a fragment
export const url = Validators.pattern(/^(\/|\w+:\/\/).+$/);

export const archiveUri = Validators.pattern(/^(file|s3):\/\/.+$/);

export const password = Validators.compose([
  Validators.minLength(8),
  Validators.maxLength(64),
  Validators.pattern(
    '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z].{8,}|^{cipher}.+'
  )
]);

export function requiredList(
  control: AbstractControl
): { required: boolean } | null {
  return control.value != null && control.value.length > 0
    ? null
    : { required: true };
}

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
