import { Component, Inject, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { ReferenceLink } from "../../../shared/components";

@Component({
	selector: "demo-footer",
	templateUrl: "./demo-footer-page.component.html"
})
export class DemoFooterPageComponent implements OnInit {
	public footerHtml: string;
	public referenceList: ReferenceLink[];

	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		this.footerHtml = `<stark-app-footer
	legalInfoUrl="https://www.nbb.be/en/disclaimer-and-legal-information"
	helpPageUrl="https://www.nbb.be/en/links">

	<!-- Included html will be displayed at the left of the footer -->
	<a htref="https://www.some-page.com/">Some link</a>

</stark-app-footer>`;

		this.referenceList = [
			{
				label: "Stark Footer component",
				url: "https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkAppFooterComponent.html"
			}
		];
	}
}
