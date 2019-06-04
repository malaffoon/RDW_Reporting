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
    this.form = this.formBuilder.group({
      sandboxKey: [null, Validators.required],
      username: [null, Validators.required],
      role: [{ value: null, disabled: true }, Validators.required]
    });

    this.route.queryParams.subscribe(queryParams => {
      if (queryParams.key) {
        this.form.get('sandboxKey').setValue(queryParams.key);
      }
      if (queryParams.username) {
        this.form.get('username').setValue(queryParams.username);
      }
      if (queryParams.role) {
        const roleControl = this.form.get('role');
        roleControl.enable();
        roleControl.setValue(queryParams.role);
      }

      if (queryParams.key && queryParams.username && queryParams.role) {
        this.login();
      }
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

  private login() {
    const sandboxUser = { ...this.form.value };
    this.service.login(sandboxUser).subscribe(
      () => console.log('Login successful'), // TODO: Do the redirect here into the actual sandbox homepage if necessary
      error => this.notificationService.error({ id: 'sandbox-login.error' })
    );
  }
}
