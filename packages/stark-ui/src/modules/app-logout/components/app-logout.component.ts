import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	Inject,
	Input,
	OnInit,
	Optional,
	Renderer2,
	ViewEncapsulation
} from "@angular/core";

import {
	STARK_LOGGING_SERVICE,
	STARK_ROUTING_SERVICE,
	STARK_SESSION_CONFIG,
	STARK_SESSION_SERVICE,
	StarkLoggingService,
	StarkRoutingService,
	StarkSessionConfig,
	starkSessionLogoutStateName,
	StarkSessionService
} from "@nationalbankbelgium/stark-core";
import { AbstractStarkUiComponent } from "@nationalbankbelgium/stark-ui/src/internal-common";

/**
 * @ignore
 */
const componentName = "stark-app-logout";

/**
 * Component to display the application's logout button
 */
@Component({
	selector: "stark-app-logout",
	templateUrl: "./app-logout.component.html",
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	// We need to use host instead of @HostBinding: https://github.com/NationalBankBelgium/stark/issues/664
	host: {
		class: componentName
	}
})
export class StarkAppLogoutComponent extends AbstractStarkUiComponent implements OnInit {
	/**
	 * Desired icon of the logout button
	 */
	@Input()
	public icon: "power" | string = "power";

	/**
	 * Class constructor
	 * @param logger - The `StarkLoggingService` instance of the application.
	 * @param routingService - The `StarkRoutingService` instance of the application.
	 * @param sessionService - The `StarkSessionService` instance of the application.
	 * @param renderer - Angular `Renderer2` wrapper for DOM manipulations.
	 * @param elementRef - Reference to the DOM element where this component is attached to.
	 * @param sessionConfig - The configuration of the session module
	 */
	public constructor(
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		@Inject(STARK_ROUTING_SERVICE) public routingService: StarkRoutingService,
		@Inject(STARK_SESSION_SERVICE) public sessionService: StarkSessionService,
		renderer: Renderer2,
		elementRef: ElementRef,
		@Optional()
		@Inject(STARK_SESSION_CONFIG)
		public sessionConfig?: StarkSessionConfig
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

	/**
	 * Handles the event when a click is made on the logout button
	 */
	public logout(): void {
		this.sessionService.logout();

		let sessionLogoutStateName: string = starkSessionLogoutStateName;
		if (
			this.sessionConfig &&
			typeof this.sessionConfig.sessionLogoutStateName !== "undefined" &&
			this.sessionConfig.sessionLogoutStateName !== ""
		) {
			sessionLogoutStateName = this.sessionConfig.sessionLogoutStateName;
		}
		this.routingService.navigateTo(sessionLogoutStateName);
	}
}
