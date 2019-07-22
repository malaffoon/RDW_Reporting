import { Directive, OnDestroy, Optional, Self, SkipSelf } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormGroupDirective } from '@angular/forms';

/**
 * Allows for nested form components to be marked as submitted.
 * This helps when displaying form errors on submission
 */
@Directive({
  selector: '[nestableFormGroup]'
})
export class NestableFormGroup implements OnDestroy {
  private destroyed$ = new Subject<void>();

  constructor(
    @Self() formGroupDirective: FormGroupDirective,
    @Optional() @SkipSelf() parentFormGroupDirective: FormGroupDirective
  ) {
    if (parentFormGroupDirective) {
      parentFormGroupDirective.ngSubmit
        .pipe(takeUntil(this.destroyed$))
        .subscribe((event: any) => {
          formGroupDirective.onSubmit(event);
        });
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
