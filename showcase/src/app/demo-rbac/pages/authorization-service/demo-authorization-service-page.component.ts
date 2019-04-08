import { Component } from "@angular/core";
import { ReferenceLink } from "../../../shared/components/reference-block";

@Component({
	selector: "demo-authorization-service",
	templateUrl: "./demo-authorization-service-page.component.html",
	styleUrls: ["./demo-authorization-service-page.component.scss"]
})
export class DemoAuthorizationServicePageComponent {
	public referenceList: ReferenceLink[] = [
		{
			label: "Stark RBAC Authorization service",
			url: "https://stark.nbb.be/api-docs/stark-rbac/latest/interfaces/StarkRBACAuthorizationService.html"
		},
		{
			label: "Stark RBAC State declaration",
			url: "https://stark.nbb.be/api-docs/stark-rbac/latest/interfaces/StarkRBACStateDeclaration.html"
		},
		{
			label: "Stark RBAC State permissions",
			url: "https://stark.nbb.be/api-docs/stark-rbac/latest/interfaces/StarkRBACStatePermissions.html"
		},
		{
			label: "Stark RBAC State redirection",
			url: "https://stark.nbb.be/api-docs/stark-rbac/latest/interfaces/StarkStateRedirection.html"
		}
	];

	public stateDeclarations = `
	import { DemoProtectedPageComponent } from "./pages";
	import { StarkRBACStateDeclaration } from "@nationalbankbelgium/stark-rbac";
	
	const stateDeclarations: StarkRBACStateDeclaration[] = [
		{
			name: "demo-rbac.protected-page-admin",
			url: "/protected-page-admin",
			data: {
				permissions: {
					only: ["admin"]
				}
			},
			views: { "@": { component: DemoProtectedPageComponent } }
		},
		{
			name: "demo-rbac.protected-page-manager",
			url: "/protected-page-manager",
			data: {
				permissions: {
					only: ["manager"]
				}
			},
			views: { "@": { component: DemoProtectedPageComponent } }
		},
		{
			name: "demo-rbac.protected-page-super-admin",
			url: "/protected-page-manager",
			data: {
				permissions: {
					only: ["super-admin"],
					redirectTo: {
						stateName: "news"
					}
				}
			},
			views: { "@": { component: DemoProtectedPageComponent } }
		}
	];`;
}
