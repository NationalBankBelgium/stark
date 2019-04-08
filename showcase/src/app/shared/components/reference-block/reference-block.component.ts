import { Component, HostBinding, Inject, Input, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { ReferenceLink } from "./reference-link.intf";

const componentName = "stark-reference-block";

/**
 * Component to display a list of URLS to documentation
 */
@Component({
	selector: "stark-reference-block",
	templateUrl: "./reference-block.component.html"
})
export class ReferenceBlockComponent implements OnInit {
	@HostBinding("class")
	public class: string = componentName;

	@Input()
	public links: ReferenceLink[] = [];

	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		this.logger.debug(componentName + ": controller initialized");
	}

	/**
	 * @ignore
	 */
	public trackItemFn(_index: number, item: any): string {
		return item;
	}
}
