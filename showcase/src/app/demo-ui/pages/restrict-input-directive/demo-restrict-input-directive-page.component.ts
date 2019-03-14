import { Component } from "@angular/core";
import { ReferenceLink } from "../../../shared/components";

@Component({
	selector: "demo-restrict-input-directive",
	templateUrl: "./demo-restrict-input-directive-page.component.html"
})
export class DemoRestrictInputDirectivePageComponent {
	public referenceList: ReferenceLink[] = [
		{
			label: "Stark Restrict Input directive",
			url: "https://stark.nbb.be/api-docs/stark-ui/latest/directives/StarkRestrictInputDirective.html"
		}
	];
}
