import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SandboxLoginService } from './sandbox-login.service';
import { Sandbox } from './sandbox';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'sandbox-login',
  templateUrl: './sandbox-login.component.html',
  styleUrls: ['./sandbox-login.component.less']
})
export class SandboxLoginComponent implements OnInit, OnDestroy {
  formGroup: FormGroup = new FormGroup({
    sandbox: new FormControl(null, [Validators.required]),
    role: new FormControl(null, [Validators.required])
  });

  initialized: boolean;
  sandboxes: Sandbox[];
  private _destroyed: Subject<void> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private service: SandboxLoginService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    combineLatest(this.route.queryParams, this.service.getAll())
      .pipe(takeUntil(this._destroyed))
      .subscribe(([params, sandboxes]) => {
        this.sandboxes = sandboxes;

        const sandbox = sandboxes.find(({ key }) => key === params.sandbox);
        const role =
          sandbox != null
            ? sandbox.roles.find(({ id }) => id === params.role)
            : undefined;

        this.formGroup.patchValue({
          sandbox,
          role
        });

        if (sandbox != null) {
          this.formGroup.controls.sandbox.disable();
        }

        this.initialized = true;
      });

    this.formGroup.controls.sandbox.valueChanges
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => {
        this.onSandboxChange();
      });
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  onSandboxChange(): void {
    const { sandbox, role } = this.formGroup.controls;
    if (sandbox.value == null) {
      role.disable();
      role.setValue(null);
    } else {
      role.enable();
      role.setValue(sandbox.value.roles[0]);
    }
  }

  onSubmit(): void {
    const { sandbox, role } = this.formGroup.getRawValue();
    const username = this.translateService.instant(
      `sandbox-login.sandbox-role-username.${role.type}`
    );
    const encode = encodeURIComponent;
    window.location.href = `/sandbox/login?sandbox=${encode(
      sandbox.key
    )}&username=${encode(username)}&role=${encode(role.id)}`;
  }
}
