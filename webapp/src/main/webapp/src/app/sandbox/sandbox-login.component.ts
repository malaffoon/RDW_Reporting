import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SandboxLoginService } from './sandbox-login.service';
import { Role, Sandbox } from './sandbox';

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
    private service: SandboxLoginService
  ) {}

  ngOnInit(): void {
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
    // TODO: Integrate with backend APIs/login
    console.log(this.form.value);
  }
}
