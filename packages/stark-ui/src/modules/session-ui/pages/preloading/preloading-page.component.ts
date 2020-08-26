import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { RawParams } from "@uirouter/core";
import { delay, take } from "rxjs/operators";

import {
	STARK_LOGGING_SERVICE,
	STARK_ROUTING_SERVICE,
	STARK_SESSION_SERVICE,
	STARK_USER_SERVICE,
	StarkLoggingService,
	StarkRoutingService,
	StarkSessionService,
	StarkUser,
	StarkUserService
} from "@nationalbankbelgium/stark-core";

/**
 * @ignore
 */
const componentName = "stark-preloading-page";

/**
 * Preloading Page smart component.
 *
 * This page will be shown when the application starts and will fetch the user profile (via the {@link StarkUserService}) to perform the login of the user.
 * It will redirect to the target page (via the {@link StarkRoutingService}) as soon as the user profile is loaded and logged in.
 */
@Component({
	selector: "stark-preloading-page",
	templateUrl: "./preloading-page.component.html",
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: componentName
	}
})
export class StarkPreloadingPageComponent implements OnInit {
	/**
	 * Target page to navigate to after the user profile is loaded and automatically logged in.
	 */
	@Input()
	public targetState?: string;

	/**
	 * Params to pass to the target page (if any).
	 */
	@Input()
	public targetStateParams?: RawParams;

	/**
	 * Whether the fetching of the user profile failed
	 */
	public userFetchingFailed = false;

	/**
	 * The current correlation Id of the application (useful when troubleshooting errors).
	 */
	public correlationId = "undefined";

	/**
	 * @ignore
	 */
	public loginDelay = 200;

	/**
	 * Class constructor
	 * @param logger - The `StarkLoggingService` instance of the application.
	 * @param userService - The `StarkUserService` instance of the application.
	 * @param sessionService - The `StarkSessionService` instance of the application.
	 * @param routingService - The `StarkRoutingService` instance of the application.
	 */
	public constructor(
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		@Inject(STARK_USER_SERVICE) public userService: StarkUserService,
		@Inject(STARK_SESSION_SERVICE) public sessionService: StarkSessionService,
		@Inject(STARK_ROUTING_SERVICE) public routingService: StarkRoutingService
	) {}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		// the result is delayed for some milliseconds,
		// otherwise the page will show an ugly flickering (if the profile is fetched immediately)
		this.userService
			.fetchUserProfile()
			.pipe(
				take(1), // this ensures that the observable will be automatically unsubscribed after emitting the value
				delay(this.loginDelay)
			)
			.subscribe(
				(user: StarkUser) => {
					this.sessionService.login(user);
					if (this.targetState) {
						this.routingService.navigateTo(this.targetState, this.targetStateParams);
					} else {
						this.routingService.navigateToHome();
					}
				},
				() => {
					this.correlationId = this.logger.correlationId;
					this.userFetchingFailed = true;
				}
			);

		this.logger.debug(componentName + ": component initialized");
	}

	/**
	 * Reload the page through the routingService.
	 */
	public reload(): void {
		this.routingService.reload();
	}
}
