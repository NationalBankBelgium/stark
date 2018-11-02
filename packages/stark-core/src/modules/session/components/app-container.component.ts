import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "../../logging/services";
import { STARK_ROUTING_SERVICE, StarkRoutingService } from "../../routing/services";
import { starkAppExitStateName, starkAppInitStateName } from "../routes";

/**
 * Name of the component
 */
const componentName: string = "stark-app-container";

/**
 * Component to coordinate the display of the init/exit states when the application starts or ends and hide the application content.
 * For any other state it simply displays the application content hiding any init/exit state.
 */
@Component({
	selector: "stark-app-container",
	templateUrl: "./app-container.component.html",
	encapsulation: ViewEncapsulation.None,
	// tslint:disable-next-line: use-host-property-decorator
	host: {
		class: componentName
	}
})
export class StarkAppContainerComponent implements OnInit {
	/**
	 * Class constructor
	 * @param logger - The logger of the application
	 * @param routingService - The routing service of the application
	 */
	public constructor(
		@Inject(STARK_LOGGING_SERVICE) private logger: StarkLoggingService,
		@Inject(STARK_ROUTING_SERVICE) private routingService: StarkRoutingService
	) {}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		this.logger.debug(componentName + ": component initialized.");
	}

	/**
	 * Check if the current state is an init or exit state (with "starkAppInit" or "starkAppExit" as parent state name)
	 */
	public isAppInitOrExitState(): boolean {
		return (
			this.routingService.isCurrentUiStateIncludedIn(starkAppInitStateName + ".**") ||
			this.routingService.isCurrentUiStateIncludedIn(starkAppExitStateName + ".**")
		);
	}
}
