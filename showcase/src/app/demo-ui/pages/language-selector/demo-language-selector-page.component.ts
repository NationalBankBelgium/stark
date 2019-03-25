import { Component } from "@angular/core";
import { ReferenceLink } from "../../../shared/components";

@Component({
	selector: "demo-language-selector",
	templateUrl: "./demo-language-selector-page.component.html"
})
export class DemoLanguageSelectorPageComponent {
	public referenceList: ReferenceLink[] = [
		{
			label: "Stark Language Selector component",
			url: "https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkLanguageSelectorComponent.html"
		}
	];
}
