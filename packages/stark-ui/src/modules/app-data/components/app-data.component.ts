import { ChangeDetectionStrategy, Component, ElementRef, Inject, Input, OnInit, Renderer2, ViewEncapsulation } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { AbstractStarkUiComponent } from "../../../common/classes/abstract-component";

/**
 * @ignore
 */
const componentName = "stark-app-data";

/**
 * Modes in which the {@link StarkAppDataComponent} can be displayed
 */
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
	 *
	 * Default: `"dropdown"`
	 */
	@Input() public mode?: StarkAppDataComponentMode = "dropdown";

	/**
	 * Class constructor
	 * @param logger - The `StarkLoggingService` instance of the application.
	 * @param renderer - Angular `Renderer2` wrapper for DOM manipulations.
	 * @param elementRef - Reference to the DOM element where this component is attached to.
	 */
	public constructor(
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		renderer: Renderer2,
		elementRef: ElementRef
	) {
		super(renderer, elementRef);
	}

	/**
	 * Component lifecycle hook
	 */
	public override ngOnInit(): void {
		super.ngOnInit();
		this.logger.debug(componentName + ": controller initialized");
	}
}
