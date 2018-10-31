import { Component, Inject, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { ReferenceLink } from "../../shared/reference-block";

@Component({
	selector: "demo-logout",
	templateUrl: "./demo-logout.component.html"
})
export class DemoLogoutComponent implements OnInit {
	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {}

	public referenceList: ReferenceLink[];
	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		this.referenceList = [
			{
				label: "Stark AppLogout component",
				url: "https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkAppLogoutComponent.html"
			}
		];
	}
}
