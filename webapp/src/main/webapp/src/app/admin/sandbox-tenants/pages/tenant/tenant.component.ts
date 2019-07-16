import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { flatMap } from 'rxjs/operators';
import { TenantService } from '../../service/tenant.service';
import { SandboxConfiguration } from '../../model/sandbox-configuration';

@Component({
  selector: 'app-tenant',
  templateUrl: './tenant.component.html',
  styleUrls: ['./tenant.component.less']
})
export class TenantComponent implements OnInit {
  tenant$: SandboxConfiguration;

  constructor(private route: ActivatedRoute, private service: TenantService) {
    this.tenant$ = this.route.params.pipe(
      flatMap(({ id }) => this.service.get(id))
    );
  }

  ngOnInit() {}
}
