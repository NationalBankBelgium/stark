import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { RawParams } from "@uirouter/core";
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
const componentName = "stark-login-page";

/**
 * Login Page smart component.
 * **This page is to be used only in the development environment.**
 *
 * It shows a list of user profiles (provided by mock data or a back-end) that the user can choose and use it to impersonate himself as someone else.
 * This makes it easy to run the application with different roles.
 */
@Component({
	selector: "stark-login-page",
	templateUrl: "./login-page.component.html",
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: componentName
	}
})
export class StarkLoginPageComponent implements OnInit {
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
	 * User profiles to be displayed in the list where the user can choose from.
	 */
	public users: StarkUser[] = [];

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
		this.users = this.userService.getAllUsers();
		this.logger.debug(componentName + ": component initialized");
	}

	/**
	 * Authenticate the passed user as the current user.
	 * @param user - The user to be authenticated
	 */
	public authenticateUser(user: StarkUser): void {
		this.sessionService.login(user);
		if (this.targetState) {
			this.routingService.navigateTo(this.targetState, this.targetStateParams);
		} else {
			this.routingService.navigateToHome();
		}
	}

	/**
	 * Check if users are defined in the component
	 */
	public userProfilesAvailable(): boolean {
		return typeof this.users !== "undefined" && this.users.length > 0;
	}

	/**
	 * Returns a string with the roles of the user.
	 * @param user - The user who has the roles
	 */
	public getUserRoles(user: StarkUser): string {
		if (user.roles.length > 0) {
			return user.roles.toString();
		}
		return "";
	}

	/**
	 * @ignore
	 */
	public trackItemFn(_index: number, item: any): string {
		return item;
	}
}
