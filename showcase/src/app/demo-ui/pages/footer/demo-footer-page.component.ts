import { Component } from "@angular/core";
import { ReferenceLink } from "../../../shared/components";

@Component({
	selector: "demo-footer",
	templateUrl: "./demo-footer-page.component.html"
})
export class DemoFooterPageComponent {
	public footerHtml = `
<stark-app-footer
  legalInfoUrl="https://www.nbb.be/en/disclaimer-and-legal-information"
  helpPageUrl="https://www.nbb.be/en/links"
>
  <!-- Included html will be displayed at the left of the footer -->
  <a htref="https://www.some-page.com/">Some link</a>
</stark-app-footer>
`;
	public referenceList: ReferenceLink[] = [
		{
			label: "Stark Footer component",
			url: "https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkAppFooterComponent.html"
		}
	];
}
