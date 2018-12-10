import { Component, Inject, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkBreadcrumbConfig } from "@nationalbankbelgium/stark-ui";
import { ReferenceLink } from "../../../shared/components";

const componentName: string = "demo-breadcrumb";

/**
 * Demo Breadcrumb component page
 */
@Component({
	selector: "demo-breadcrumb",
	templateUrl: "./demo-breadcrumb-page.component.html"
})
export class DemoBreadcrumbPageComponent implements OnInit {
	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {}
	public referenceList: ReferenceLink[];

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		this.logger.debug(componentName + ": controller initialized");

		this.referenceList = [
			{
				label: "Stark Breadcrumb component",
				url: "https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkBreadcrumbComponent.html"
			}
		];
	}

	public breadcrumbConfig: StarkBreadcrumbConfig = {
		breadcrumbPaths: [
			{
				id: "path 1",
				state: "Root ancestor",
				stateParams: { param1: "param 1", param2: "param 2" },
				translationKey: "SHOWCASE.DEMO.BREADCRUMB.ROOT"
			},
			{
				id: "path 1.1",
				state: "Grand-parent",
				stateParams: { param3: "param 3", param4: "param 4" },
				translationKey: "SHOWCASE.DEMO.BREADCRUMB.GRANDPARENT"
			},
			{
				id: "path 1.1.1",
				state: "Parent",
				stateParams: { param5: "param 5", param6: "param 6" },
				translationKey: "SHOWCASE.DEMO.BREADCRUMB.PARENT"
			},
			{
				id: "path 1.1.1.1",
				state: "Child",
				stateParams: { param7: "param 7", param8: "param 8" },
				translationKey: "SHOWCASE.DEMO.BREADCRUMB.CHILD"
			}
		]
	};
}
