import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SandboxConfiguration } from './sandbox-configuration';
import { SandboxService } from './sandbox.service';

@Component({
  selector: 'sandbox-config',
  templateUrl: './sandbox.component.html'
})
export class SandboxConfigurationComponent {
  sandboxes: SandboxConfiguration[];

  constructor(private route: ActivatedRoute, private service: SandboxService) {}

  ngOnInit(): void {
    this.service.getAll().subscribe(sandboxes => (this.sandboxes = sandboxes));
  }

  saveSandbox($event: SandboxConfiguration): void {
    // TODO: Add the save service call to actually persist the sandbox configuration on the backend
    this.sandboxes.push($event);
  }

  deleteSandbox($event: SandboxConfiguration): void {
    //TODO: Remove this once we have an actual DELETE API in place
    const index: number = this.sandboxes.indexOf($event);
    if (index !== -1) {
      this.sandboxes.splice(index, 1);
    }
  }
}
