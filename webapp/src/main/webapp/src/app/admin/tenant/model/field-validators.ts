import { Validators } from '@angular/forms';

// requires a scheme
export const uri = Validators.pattern(/^.+:\/\/.+$/);

// can be a fragment
export const url = Validators.pattern(/^[\/|\w+:\/\/].+$/);

export const password = Validators.compose([
  Validators.minLength(8),
  Validators.maxLength(64),
  Validators.pattern(
    '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()-+])[A-Za-z].{8,}|^{cipher}.+'
  )
]);
