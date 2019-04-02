import { Component } from "@angular/core";
import { MatButtonToggleChange } from "@angular/material/button-toggle";
import { StarkRBACDirectivePermission } from "@nationalbankbelgium/stark-rbac";

@Component({
	selector: "demo-authorization-directives",
	templateUrl: "./demo-authorization-directives-page.component.html",
	styleUrls: ["./demo-authorization-directives-page.component.scss"]
})
export class DemoAuthorizationDirectivesPageComponent {
	public selectedUnauthorizedRole: string = "manager"; // current user's role

	public get permissionsConfig(): StarkRBACDirectivePermission {
		return {
			roles: [this.selectedUnauthorizedRole]
		};
	}

	public onRoleChange(changeEvent: MatButtonToggleChange): void {
		this.selectedUnauthorizedRole = changeEvent.value;
	}
}
