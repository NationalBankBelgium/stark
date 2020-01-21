import { ChangeDetectionStrategy, Component, ElementRef, Inject, Input, OnInit, Renderer2, ViewEncapsulation } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { AbstractStarkUiComponent } from "../../../common/classes/abstract-component";

/**
 * Name of the component
 */
const componentName = "stark-app-data";

export type StarkAppDataComponentMode = "dropdown" | "menu";

/**
 * Component to display all the data concerning the current user session including the following info:
 * - User full name + profile.
 * - Last access date of the user.
 * - App version + Environment (PROD, DEV, etc...).
 */
@Component({
	selector: "stark-app-data",
	templateUrl: "./app-data.component.html",
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: componentName
	}
})
export class StarkAppDataComponent extends AbstractStarkUiComponent implements OnInit {
	/**
	 * The mode in which the component should be displayed.
	 * Default: "dropdown"
	 */
	@Input() public mode?: StarkAppDataComponentMode = "dropdown";

	public constructor(
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		protected renderer: Renderer2,
		protected elementRef: ElementRef
	) {
		super(renderer, elementRef);
	}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		this.logger.debug(componentName + ": controller initialized");
	}
}
