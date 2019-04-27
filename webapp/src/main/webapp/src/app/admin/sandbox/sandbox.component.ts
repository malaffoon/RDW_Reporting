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
}
