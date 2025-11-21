import { Component } from "@angular/core";
import { ReferenceLink } from "../../../shared/components";
import { mdiLogout } from "@nationalbankbelgium/mdi-ts";

@Component({
	selector: "demo-logout",
	templateUrl: "./demo-logout-page.component.html"
})
export class DemoLogoutPageComponent {
	protected readonly mdiLogout = mdiLogout;

	public referenceList: ReferenceLink[] = [
		{
			label: "Stark AppLogout component",
			url: "https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkAppLogoutComponent.html"
		}
	];
}
