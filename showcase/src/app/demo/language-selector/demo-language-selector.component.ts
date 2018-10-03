import { Component, Inject, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { ReferenceLink } from "../../shared/reference-block";

@Component({
	selector: "demo-language-selector",
	templateUrl: "./demo-language-selector.component.html"
})
export class DemoLanguageSelectorComponent implements OnInit {
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
