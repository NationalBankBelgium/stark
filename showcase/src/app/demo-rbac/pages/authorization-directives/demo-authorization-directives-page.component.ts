import { Component } from "@angular/core";
import { MatButtonToggleChange } from "@angular/material/button-toggle";
import { StarkRBACDirectivePermission } from "@nationalbankbelgium/stark-rbac";
import { ReferenceLink } from "../../../shared/components/reference-block";

@Component({
	selector: "demo-authorization-directives",
	templateUrl: "./demo-authorization-directives-page.component.html",
	styleUrls: ["./demo-authorization-directives-page.component.scss"]
})
export class DemoAuthorizationDirectivesPageComponent {
	public selectedAuthorizedRole = "manager"; // current user's role
	public selectedUnauthorizedRole = "manager"; // current user's role

	public referenceList: ReferenceLink[] = [
		{
			label: "Stark Show On Permission directive",
			url: "https://stark.nbb.be/api-docs/stark-rbac/latest/directives/StarkShowOnPermissionDirective.html"
		},
		{
			label: "Stark Hide On Permission directive",
			url: "https://stark.nbb.be/api-docs/stark-rbac/latest/directives/StarkHideOnPermissionDirective.html"
		}
	];

	public get onHidePermissionsConfig(): StarkRBACDirectivePermission {
		return {
			roles: [this.selectedUnauthorizedRole]
		};
	}

	public get onShowPermissionsConfig(): StarkRBACDirectivePermission {
		return {
			roles: [this.selectedAuthorizedRole]
		};
	}

	public onAuthorizedRoleChange(changeEvent: MatButtonToggleChange): void {
		this.selectedAuthorizedRole = changeEvent.value;
	}

	public onUnauthorizedRoleChange(changeEvent: MatButtonToggleChange): void {
		this.selectedUnauthorizedRole = changeEvent.value;
	}
}
