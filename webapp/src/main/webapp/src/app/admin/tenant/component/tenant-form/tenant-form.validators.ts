import {
  AbstractControl,
  AsyncValidatorFn,
  FormGroup,
  Validators
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const tenantKey = Validators.pattern(/^\w+$/);

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

const passwordKeyExpression = /(.+)\.password$/;

export function onePasswordPerUser(
  formGroup: FormGroup
): { onePasswordPerUser: { usernames: string[] } } | null {
  const controlNames = Object.keys(formGroup.controls);

  const passwordKeys = controlNames.filter(controlName =>
    passwordKeyExpression.test(controlName)
  );

  const passwordsByUsername: {
    [username: string]: string[];
  } = passwordKeys.reduce((byUsername, passwordKey) => {
    // assumes username of same base path for every password
    const usernameKey = `${
      passwordKeyExpression.exec(passwordKey)[1]
    }.username`;
    // this is being run on every form control addition so we need to defensively set this
    const username = (formGroup.controls[usernameKey] || <any>{}).value || '';
    const password = (formGroup.controls[passwordKey] || <any>{}).value || '';
    const passwords = byUsername[username];
    if (passwords != null) {
      if (!passwords.includes(password)) {
        passwords.push(password);
      }
    } else {
      byUsername[username] = [password];
    }
    return byUsername;
  }, {});

  const usernames = Object.entries(passwordsByUsername)
    .filter(([, passwords]) => passwords.length > 1)
    .map(([username]) => username);

  return usernames.length > 0 ? { onePasswordPerUser: { usernames } } : null;
}
