import { Component } from "@angular/core";
import { MatButtonToggleChange } from "@angular/material/button-toggle";
import { StarkRBACDirectivePermission } from "@nationalbankbelgium/stark-rbac";

@Component({
	selector: "demo-authorization-directives",
	templateUrl: "./demo-authorization-directives-page.component.html",
	styleUrls: ["./demo-authorization-directives-page.component.scss"]
})
export class DemoAuthorizationDirectivesPageComponent {
	public selectedAuthorizedRole = "manager"; // current user's role

	public get permissionsConfig(): StarkRBACDirectivePermission {
		return {
			roles: [this.selectedAuthorizedRole]
		};
	}

	public onRoleChange(changeEvent: MatButtonToggleChange): void {
		this.selectedAuthorizedRole = changeEvent.value;
	}
}
