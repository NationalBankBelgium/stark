import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	Inject,
	Input,
	OnDestroy,
	OnInit,
	Output,
	ViewChild,
	ViewEncapsulation,
	Renderer2
} from "@angular/core";
import { MatExpansionPanel } from "@angular/material/expansion";
import {
	STARK_LOGGING_SERVICE,
	STARK_ROUTING_SERVICE,
	StarkLoggingService,
	StarkRoutingService,
	StarkRoutingTransitionHook
} from "@nationalbankbelgium/stark-core";
import { AbstractStarkUiComponent } from "./../../../common/classes/abstract-component";
import { StarkMenuGroup } from "./app-menu-group.intf";

/**
 * Name of the component
 */
const componentName: string = "stark-app-menu-item";

/**
 * Component to display app-menu-item based on the options passed as parameters.
 */
@Component({
	selector: "stark-app-menu-item",
	templateUrl: "./app-menu-item.component.html",
	encapsulation: ViewEncapsulation.None,
	host: {
		class: componentName
	}
})
export class StarkAppMenuItemComponent extends AbstractStarkUiComponent implements OnInit, AfterViewInit, OnDestroy {
	/**
	 * Current menu level
	 */
	@Input()
	public level: number;

	/**
	 * Data source of the component
	 */
	@Input()
	public menuGroup: StarkMenuGroup;

	/**
	 * Event to emit when the component is activated
	 */
	@Output()
	public activated: EventEmitter<void> = new EventEmitter();

	/**
	 * Event to emit when the component is deactivated
	 */
	@Output()
	public deactivated: EventEmitter<void> = new EventEmitter();

	/**
	 * Viewchild catching the extension panel in order to open/close it programmatically
	 */
	@ViewChild("menuGroupsPanel")
	public menuGroupsPanel: MatExpansionPanel;

	/**
	 * Active status of the component
	 */
	private _isActive: boolean = false;
	public set isActive(isActive: boolean) {
		this._isActive = isActive;
		if (isActive && this.menuGroup.entries) {
			this.menuGroupsPanel.open();
		}

		if (isActive) {
			this.activated.emit();
		} else {
			this.deactivated.emit();
		}
	}
	public get isActive(): boolean {
		return this._isActive;
	}

	/**
	 * Routing transition finish callback
	 */
	private routingTransitionFinishCallback: Function;

	/**
	 * Routing transition success callback
	 */
	private routingTransitionSuccessCallback: Function;

	/**
	 * Class constructor
	 * @param logger - The logger of the application
	 * @param routingService - The router of the application
	 * @param renderer - The custom render of the component
	 * @param elementRef - The elementRef of the component
	 */
	public constructor(
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		@Inject(STARK_ROUTING_SERVICE) public routingService: StarkRoutingService,
		protected renderer: Renderer2,
		protected elementRef: ElementRef
	) {
		super(renderer, elementRef);
	}

	/**
	 * Component OnInit lifecycle hook
	 */
	public ngOnInit(): void {
		this.logger.debug(componentName + ": component initialized");
		super.ngOnInit();
	}

	/**
	 * Component AfterViewInit lifecycle hook
	 */
	public ngAfterViewInit(): void {
		this.routingTransitionSuccessCallback = this.routingService.addTransitionHook(StarkRoutingTransitionHook.ON_SUCCESS, {}, () => {
			if (this.isCurrentState()) {
				this.isActive = true;
			}
		});

		this.routingTransitionFinishCallback = this.routingService.addTransitionHook(StarkRoutingTransitionHook.ON_FINISH, {}, () => {
			this.isActive = false;
		});
	}

	/**
	 * Component OnDestroy lifecycle hook
	 */
	public ngOnDestroy(): void {
		this.routingTransitionFinishCallback();
		this.routingTransitionSuccessCallback();
	}

	/**
	 * Click event handler
	 */
	public onClick(): void {
		if (this.menuGroup.isEnabled) {
			if (this.menuGroup.targetState) {
				this.routingService.navigateTo(this.menuGroup.targetState, this.menuGroup.targetStateParams);
			} else if (this.menuGroup.entries) {
				this.menuGroupsPanel.toggle();
			}
		}
	}

	/**
	 * Activate event handler
	 */
	public onActivate(): void {
		this.isActive = true;
	}

	/**
	 * Deactivate event handler
	 */
	public onDeactivate(): void {
		this.isActive = false;
	}

	/**
	 * Utility function to check if the component targetState is the current state
	 */
	public isCurrentState(): boolean {
		return this.menuGroup.targetState ? this.routingService.isCurrentUiState(this.menuGroup.targetState) : false;
	}

	/**
	 * @ignore
	 */
	public trackMenuItem(index: number, _menuGroup: StarkMenuGroup): number {
		return index;
	}
}
