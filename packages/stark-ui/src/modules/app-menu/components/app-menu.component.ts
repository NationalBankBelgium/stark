import { ChangeDetectionStrategy, Component, ElementRef, Inject, Input, OnInit, Renderer2, ViewEncapsulation } from "@angular/core";
import { STARK_LOGGING_SERVICE, STARK_ROUTING_SERVICE, StarkLoggingService, StarkRoutingService } from "@nationalbankbelgium/stark-core";
import { AbstractStarkUiComponent } from "../../../common/classes/abstract-component";
import { StarkMenuSection } from "./app-menu-section.intf";
import { StarkMenuConfig } from "./app-menu-config.intf";
import { StarkMenuGroup } from "./app-menu-group.intf";

/**
 * @ignore
 */
const componentName = "stark-app-menu";

/**
 * Component to display app-menu based on the options passed as parameters.
 */
@Component({
	selector: "stark-app-menu",
	templateUrl: "./app-menu.component.html",
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	// We need to use host instead of @HostBinding: https://github.com/NationalBankBelgium/stark/issues/664
	host: {
		class: componentName
	}
})
export class StarkAppMenuComponent extends AbstractStarkUiComponent implements OnInit {
	/**
	 * @internal
	 * @ignore
	 */
	private _menuConfig: StarkMenuConfig = {};

	/**
	 * Configuration of the menu
	 */
	@Input()
	public set menuConfig(menuConfig: StarkMenuConfig) {
		this._menuConfig = menuConfig;
		// eslint-disable-next-line no-prototype-builtins
		this.hasSections = this._menuConfig.hasOwnProperty("menuSections");
	}

	public get menuConfig(): StarkMenuConfig {
		return this._menuConfig;
	}

	/**
	 * Either the component have section or not
	 */
	public hasSections = false;

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
	 * @ignore
	 */
	public trackSection(index: number, _section: StarkMenuSection): number {
		return index;
	}

	/**
	 * @ignore
	 */
	public trackMenuGroup(index: number, _menuGroup: StarkMenuGroup): number {
		return index;
	}
}
