import { Component, ElementRef, Inject, Input, OnDestroy, OnInit, Renderer2, ViewEncapsulation } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { StarkDOMUtil } from "../../../util/dom";
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
	host: {
		class: componentName
	}
})
export class StarkAppDataComponent extends AbstractStarkUiComponent implements OnInit, OnDestroy {
	/**
	 * The mode in which the component should be displayed.
	 */
	@Input() public mode?: StarkAppDataComponentMode = "dropdown";

	public isDetailHidden = true;

	public windowClickHandler?: EventListener;

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

		this.isDetailHidden = true;
	}

	/**
	 * Component lifecycle hook
	 */
	public ngOnDestroy(): void {
		this.removeWindowClickHandler();
	}

	/**
	 * Manage the fact that the detail are shown or hidden.
	 */
	public toggleDetail(): void {
		this.isDetailHidden = !this.isDetailHidden;

		if (this.isDetailHidden) {
			this.removeWindowClickHandler();
		} else {
			this.attachWindowClickHandler();
		}
	}

	/**
	 * Method use to attach a click handler to the window
	 */
	public attachWindowClickHandler(): void {
		this.windowClickHandler = (event: Event): void => {
			if (this.isDetailHidden) {
				return;
			}

			const parentElement: Element | undefined = StarkDOMUtil.searchParentElementByClass(<Element>event.target, componentName);
			if (parentElement) {
				return;
			}

			this.toggleDetail();
		};

		window.addEventListener("click", this.windowClickHandler);
		this.logger.debug("clickHandler added");
	}

	/**
	 * Method to remove a click handler from the windows
	 */
	public removeWindowClickHandler(): void {
		if (this.windowClickHandler) {
			this.logger.debug("clickHandler removed");
			window.removeEventListener("click", this.windowClickHandler);
			this.windowClickHandler = undefined;
		}
	}
}
