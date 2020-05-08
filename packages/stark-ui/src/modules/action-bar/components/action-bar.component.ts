import { ChangeDetectionStrategy, Component, ElementRef, Inject, Input, OnInit, Renderer2, ViewEncapsulation } from "@angular/core";
import { StarkActionBarConfig } from "./action-bar-config.intf";
import { StarkAction, StarkActionBarButtonColor } from "./action.intf";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { AbstractStarkUiComponent } from "../../../common/classes/abstract-component";

export type StarkActionBarComponentMode = "full" | "compact";

/**
 * @ignore
 */
const componentName = "stark-action-bar";

/**
 * Component to display the application's action bars
 */
@Component({
	selector: "stark-action-bar",
	templateUrl: "./action-bar.component.html",
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	// We need to use host instead of @HostBinding: https://github.com/NationalBankBelgium/stark/issues/664
	host: {
		class: componentName
	}
})
export class StarkActionBarComponent extends AbstractStarkUiComponent implements OnInit {
	/**
	 * HTML id of action bar component.
	 */
	@Input()
	public actionBarId = "";

	/**
	 * StarkActionBarConfig object.
	 */
	@Input()
	public actionBarConfig: StarkActionBarConfig = { actions: [] };

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
	public alternativeActions?: StarkAction[];

	/**
	 * Default color of the buttons
	 */
	@Input()
	public buttonColor: StarkActionBarButtonColor | string = "primary";

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
	public isExtended = false;

	/**
	 * Class constructor
	 * @param logger - The `StarkLoggingService` instance of the application.
	 * @param renderer - Angular `Renderer2` wrapper for DOM manipulations.
	 * @param elementRef - Reference to the DOM element where this component is attached to.
	 */
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
		if ($event) {
			// Prevents further propagation of the current event in the capturing and bubbling phases.
			// This makes it so that the parent does not also trigger on the event.
			$event.stopPropagation();
		}
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
