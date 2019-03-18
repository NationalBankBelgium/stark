import { Ng2StateDeclaration } from "@uirouter/angular";
import { StarkRBACStateDeclaration } from "@nationalbankbelgium/stark-rbac";
import { DemoAuthorizationDirectivesPageComponent, DemoAuthorizationServicePageComponent, DemoProtectedPageComponent } from "./pages";

export const DEMO_STATES: (Ng2StateDeclaration | StarkRBACStateDeclaration)[] = [
	{ name: "demo-rbac", url: "^/demo-rbac", abstract: true, parent: "app" },
	{
		name: "demo-rbac.authorization-directives",
		url: "/authorization-directives",
		data: {
			translationKey: "SHOWCASE.DEMO_RBAC.AUTHORIZATION_DIRECTIVES.TITLE"
		},
		views: { "@": { component: DemoAuthorizationDirectivesPageComponent } }
	},
	{
		name: "demo-rbac.authorization-service",
		url: "/authorization-service",
		data: {
			translationKey: "SHOWCASE.DEMO_RBAC.AUTHORIZATION_SERVICE.TITLE"
		},
		views: { "@": { component: DemoAuthorizationServicePageComponent } }
	},
	{
		name: "demo-rbac.protected-page-admin",
		url: "/protected-page-admin",
		data: {
			translationKey: "SHOWCASE.DEMO_RBAC.PROTECTED_PAGE.TITLE",
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
			translationKey: "SHOULD NEVER BE SHOWN",
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
			translationKey: "SHOULD NEVER BE SHOWN",
			permissions: {
				only: ["super-admin"],
				redirectTo: {
					stateName: "news"
				}
			}
		},
		views: { "@": { component: DemoProtectedPageComponent } }
	}
];
