import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { distinctUntilChanged, finalize, takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { byString } from '@kourge/ordering/comparator';
import { ordering } from '@kourge/ordering';
import { Sandbox } from '../../model/sandbox';
import { SandboxLoginService } from '../../service/sandbox-login.service';
import { uuid } from '../../../shared/support/support';
import { RdwTranslateLoader } from '../../../shared/i18n/rdw-translate-loader';

const byKey = ordering(byString).on(({ key }) => key).compare;

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
  loadingTranslations$: Subject<boolean> = new BehaviorSubject(false);
  private _destroyed: Subject<void> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private service: SandboxLoginService,
    private translateService: TranslateService,
    private translationLoader: RdwTranslateLoader
  ) {}

  ngOnInit(): void {
    this.formGroup.controls.sandbox.valueChanges
      .pipe(
        takeUntil(this._destroyed),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.onSandboxChange();
      });

    combineLatest(this.route.queryParams, this.service.getAll())
      .pipe(takeUntil(this._destroyed))
      .subscribe(([params, sandboxes]) => {
        this.sandboxes = sandboxes.slice().sort(byKey);

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
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  onSandboxChange(): void {
    const { sandbox, role } = this.formGroup.controls;
    // auto-select first role of the sandbox
    if (sandbox.value == null) {
      role.disable();
      role.setValue(null);
    } else {
      role.enable();
      role.setValue(sandbox.value.roles[0]);
    }
    // update translations
    this.loadingTranslations$.next(true);
    const tenantKey = sandbox.value != null ? sandbox.value.key : undefined;
    this.translationLoader
      .getTenantTranslation(this.translateService.currentLang, tenantKey)
      .pipe(
        finalize(() => {
          this.loadingTranslations$.next(false);
        })
      )
      .subscribe(translations => {
        this.translateService.setTranslation(
          this.translateService.currentLang,
          translations
        );
      });
  }

  onSubmit(): void {
    const { sandbox, role } = this.formGroup.getRawValue();
    const username = this.translateService.instant(
      `sandbox-login.sandbox-role-username.${role.type}`
    );
    const encode = encodeURIComponent;
    window.location.href = `/sandbox/login?sandbox=${encode(
      sandbox.key
    )}&username=${encode(username)}&role=${encode(role.id)}&userId=${encode(
      uuid()
    )}&sandboxLocked=${encode(
      this.formGroup.controls.sandbox.disabled.toString()
    )}`;
  }
}
