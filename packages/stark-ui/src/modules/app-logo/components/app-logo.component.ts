import { ChangeDetectionStrategy, Component, ElementRef, Inject, Input, OnInit, Renderer2, ViewEncapsulation } from "@angular/core";
import { STARK_LOGGING_SERVICE, STARK_ROUTING_SERVICE, StarkLoggingService, StarkRoutingService } from "@nationalbankbelgium/stark-core";
import { AbstractStarkUiComponent } from "@nationalbankbelgium/stark-ui/src/internal-common";

/**
 * @ignore
 */
const componentName = "stark-app-logo";

/**
 * Component to display the application's logo
 */
@Component({
	selector: "stark-app-logo",
	templateUrl: "./app-logo.component.html",
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	// We need to use host instead of @HostBinding: https://github.com/NationalBankBelgium/stark/issues/664
	host: {
		class: componentName
	}
})
export class StarkAppLogoComponent extends AbstractStarkUiComponent implements OnInit {
	/**
	 * Params object to be passed to the router state defined as homeState.
	 */
	@Input()
	public homeStateParams?: { [property: string]: any };

	/**
	 * Class constructor
	 * @param logger - The `StarkLoggingService` instance of the application.
	 * @param routingService - The `StarkRoutingService` instance of the application.
	 * @param renderer - Angular `Renderer2` wrapper for DOM manipulations.
	 * @param elementRef - Reference to the DOM element where this component is attached to.
	 */
	public constructor(
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		@Inject(STARK_ROUTING_SERVICE) public routingService: StarkRoutingService,
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
		this.logger.debug(componentName + ": component initialized");
	}

	/**
	 * Handles the event when a click is made on the logo
	 * @param $event - The handled event
	 */
	public logoClickHandler($event: Event): void {
		// cancel the event otherwise Angular triggers a full page reload :(
		$event.preventDefault();
		this.routingService.navigateToHome(this.homeStateParams);
	}
}
