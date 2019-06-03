import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SandboxLoginService } from './sandbox-login.service';
import { Role, Sandbox } from './sandbox';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../shared/notification/notification.service';

@Component({
  selector: 'sandbox-login',
  templateUrl: './sandbox-login.component.html'
})
export class SandboxLoginComponent implements OnInit {
  form: FormGroup;
  sandboxes: Sandbox[];
  roles: Role[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private service: SandboxLoginService,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(queryParams => this.redirect(queryParams));

    this.form = this.formBuilder.group({
      sandbox: [null, Validators.required],
      username: [null, Validators.required],
      role: [{ value: null, disabled: true }, Validators.required]
    });

    this.service.getAll().subscribe(sandboxes => (this.sandboxes = sandboxes));
  }

  sandboxSelected(selectedSandboxKey: string): void {
    const roleControl = this.form.get('role');
    if (!selectedSandboxKey) {
      roleControl.disable();
      roleControl.setValue(null);
    } else {
      roleControl.enable();
      roleControl.setValue(null);
      const selectedSandbox = this.sandboxes.find(
        sandbox => selectedSandboxKey === sandbox.key
      );
      this.roles = selectedSandbox.roles;
    }
  }

  onSubmit(): void {
    console.log(this.form.value);
    this.login(
      this.form.value.key,
      this.form.value.username,
      this.form.value.role
    );
  }

  private redirect(queryParams: any): void {
    // We only want to redirect if all three required params are defined, otherwise stay on the login page
    if (queryParams.key && queryParams.username && queryParams.role) {
      this.login(queryParams.key, queryParams.username, queryParams.role);
    }
  }

  private login(key: string, username: string, role: string) {
    this.service.login(key, username, role).subscribe(
      () => console.log('Login successful'), // TODO: Do the redirect here into the actual sandbox homepage if necessary
      error => this.notificationService.error({ id: 'sandbox-login.error' })
    );
  }
}
