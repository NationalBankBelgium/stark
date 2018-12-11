import { Component, Inject, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { ReferenceLink } from "../../../shared/components";

@Component({
	selector: "demo-language-selector",
	templateUrl: "./demo-language-selector-page.component.html"
})
export class DemoLanguageSelectorPageComponent implements OnInit {
	public referenceList: ReferenceLink[];

	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		this.referenceList = [
			{
				label: "Stark Language Selector component",
				url: "https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkLanguageSelectorComponent.html"
			}
		];
	}
}
