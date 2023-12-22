import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	EventEmitter,
	Inject,
	Input,
	OnInit,
	Output,
	Renderer2,
	ViewEncapsulation
} from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { AbstractStarkUiComponent } from "@nationalbankbelgium/stark-ui/src/internal-common";

/**
 * @ignore
 */
const componentName = "stark-collapsible";

/**
 * The default icon for a collapsible
 */
const DEFAULT_COLLAPSIBLE_ICON = "chevron-right";

/**
 * Component to display an accordion around embedded HTML
 * using {@link https://v7.material.angular.io/components/expansion/examples|Angular Material's Expansion Panel}.
 */
@Component({
	selector: "stark-collapsible",
	templateUrl: "./collapsible.component.html",
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	// We need to use host instead of @HostBinding: https://github.com/NationalBankBelgium/stark/issues/664
	host: {
		class: componentName
	}
})
export class StarkCollapsibleComponent extends AbstractStarkUiComponent implements OnInit {
	/**
	 * ID to set to the collapsible
	 */
	@Input()
	public htmlId = "";

	/**
	 * Icon to use in the header (based on Material Design Icons)
	 */
	@Input()
	public get icon(): string {
		return this._icon;
	}

	public set icon(value: string) {
		this._isDefaultIcon = typeof value === "undefined";
		this._icon = typeof value === "undefined" ? DEFAULT_COLLAPSIBLE_ICON : value;
	}

	/**
	 * for internal use only
	 * @ignore
	 */
	public _isDefaultIcon = true;
	/**
	 * for internal use only
	 * @ignore
	 */
	private _icon: string = DEFAULT_COLLAPSIBLE_ICON;

	/**
	 * Boolean value triggering the collapsing of the collapsible
	 */
	@Input()
	public isExpanded = false;

	/**
	 * Output value giving the collapse state of the collapsible.
	 *
	 * **NOTE:** isExpandedChange is used with isExpanded to create a two-way binding (using a banana in the box `[(isExpanded)]`).
	 *
	 * See: {@link https://v12.angular.io/guide/two-way-binding|Angular Template Syntax: Two Way Binding}
	 */
	@Output()
	public readonly isExpandedChange = new EventEmitter<boolean>();

	/**
	 * String or translation key that will be displayed in the title part of the header.
	 */
	@Input()
	public titleLabel = "undefined";

	/**
	 * Class constructor
	 * @param logger - The `StarkLoggingService` instance of the application.
	 * @param renderer - Angular `Renderer2` wrapper for DOM manipulations.
	 * @param elementRef - Reference to the DOM element where this component is attached to.
	 */
	public constructor(
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
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
	 * Switch and triggers the dispatch of the collapse state information.
	 */
	public toggleCollapsible(): void {
		this.isExpanded = !this.isExpanded;
		this.isExpandedChange.emit(this.isExpanded);
	}
}
