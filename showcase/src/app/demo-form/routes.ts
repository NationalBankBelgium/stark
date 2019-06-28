import { Ng2StateDeclaration } from "@uirouter/angular";
import { NgxFormErrorComponent } from "@nationalbankbelgium/ngx-form-errors";
import { DemoReactiveFormsPageComponent } from "./pages/reactive-forms/demo-reactive-forms-page.component";
import { DemoReactiveFormsWithNgxformerrorsPageComponent } from "./pages/reactive-forms-with-ngxformerrors/demo-reactive-forms-with-ngxformerrors-page.component";
import { DemoTemplateDrivenFormsPageComponent } from "./pages/template-driven-forms/demo-template-driven-forms-page.component";

export const DEMO_STATES: (Ng2StateDeclaration | NgxFormErrorComponent)[] = [
	{ name: "demo-form", url: "^/demo-form", abstract: true, parent: "app" },
	{
		name: "demo-form.reactive-forms",
		url: "/reactive-forms",
		data: {
			translationKey: "SHOWCASE.DEMO_RBAC.AUTHORIZATION_DIRECTIVES.TITLE"
		},
		views: { "@": { component: DemoReactiveFormsPageComponent } }
	},
	{
		name: "demo-rbac.reactive-forms-with-ngxformerrors",
		url: "/reactive-forms-with-ngxformerrors",
		data: {
			translationKey: "SHOWCASE.DEMO_RBAC.AUTHORIZATION_SERVICE.TITLE"
		},
		views: { "@": { component: DemoReactiveFormsWithNgxformerrorsPageComponent } }
	},
	{
		name: "demo-form.template-driven-forms",
		url: "/template-driven-forms",
		data: {
			translationKey: "SHOWCASE.DEMO_RBAC.PROTECTED_PAGE.TITLE",
			permissions: {
				only: ["admin"]
			}
		},
		views: { "@": { component: DemoTemplateDrivenFormsPageComponent } }
	}
];
