import { Component, Inject, Input, HostBinding, OnInit, ViewEncapsulation } from "@angular/core";
import { StarkActionBarConfig } from "./action-bar-config.intf";
import { StarkAction } from "./action.intf";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";

export type StarkActionBarComponentMode = "full" | "compact";

/**
 * Name of the component
 */
const componentName: string = "stark-action-bar";

/**
 * Component to display the application's action bars
 */
@Component({
	selector: "stark-action-bar",
	templateUrl: "./action-bar.component.html",
	encapsulation: ViewEncapsulation.None
})
export class StarkActionBarComponent implements OnInit {
	/**
	 * Adds class="stark-action-bar" attribute on the host component
	 */
	@HostBinding("class")
	public class: string = componentName;

	/**
	 * HTML id of action bar component.
	 */
	@Input()
	public actionBarId: string = "";

	/**
	 * StarkActionBarConfig object.
	 */
	@Input()
	public actionBarConfig: StarkActionBarConfig;

	/**
	 * If provided, this object will be passed as parameter in every
	 * action call defined
	 */
	@Input()
	public actionBarScope?: any;

	/**
	 * Alternative actions
	 */
	@Input()
	public alternativeActions: StarkAction[];

	/**
	 * Default color of the buttons
	 */
	@Input()
	public buttonColor: "primary" | "accent" | "warn" | "success" | "alert" | "alt" | "neutral" | "white" | string = "primary";

	/**
	 * Desired layout or flavour:
	 *    - full: full featured action bar with labels, expanded view, etc...
	 *    - compact: minimalistic layout with icons only.
	 */
	@Input()
	public mode: StarkActionBarComponentMode = "full";

	/**
	 * status of the extended action in full mode
	 */
	public isExtended: boolean = false;

	/**
	 * Class constructor
	 * @param logger - The logger of the application
	 */
	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		this.logger.debug(componentName + ": component initialized");
	}

	/**
	 * toggle the extended action in full mode
	 */
	public toggleExtendedActionBar(): void {
		this.isExtended = !this.isExtended;
	}

	/**
	 * Action onClick handler
	 */
	public onClick(action: StarkAction, $event: Event): void {
		if (action.isEnabled) {
			let scope: any = {};
			if (this.actionBarScope) {
				scope = this.actionBarScope;
			}
			action.actionCall($event, scope);
		}
	}

	/**
	 * @ignore
	 */
	public trackAction(_index: number, action: StarkAction): string {
		return action.id;
	}
}
