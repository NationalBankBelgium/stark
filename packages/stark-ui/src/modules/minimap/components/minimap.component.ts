import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewEncapsulation } from "@angular/core";
import { StarkMinimapItemProperties } from "./item-properties.intf";
import { AbstractStarkUiComponent } from "../../../common/classes/abstract-component";

export type StarkMinimapComponentMode = "compact";

/**
 * @ignore
 */
const componentName = "stark-minimap";

/**
 * Component to display a minimap which permits to toggle the visibility of passed elements.
 * The minimap shows the label of the elements to display with a checkbox to enable/disable the visibility
 */
@Component({
	selector: "stark-minimap",
	templateUrl: "./minimap.component.html",
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	// We need to use host instead of @HostBinding: https://github.com/NationalBankBelgium/stark/issues/664
	host: {
		class: componentName
	}
})
export class StarkMinimapComponent extends AbstractStarkUiComponent {
	/**
	 * Array of {@link StarkMinimapItemProperties} objects which define the items to display in the minimap.
	 */
	@Input()
	public items: StarkMinimapItemProperties[] = [];

	/**
	 * Array of names of the items that are visible.
	 */
	@Input()
	public visibleItems: string[] = [];

	/**
	 * the minimap mode we want to display
	 */
	@Input()
	public mode?: StarkMinimapComponentMode;

	/**
	 * Output that will emit the selected element to be shown/hidden
	 */
	@Output()
	public readonly showHideItem = new EventEmitter<StarkMinimapItemProperties>();

	/**
	 * Class constructor
	 * @param renderer - Angular `Renderer2` wrapper for DOM manipulations.
	 * @param elementRef - Reference to the DOM element where this component is attached to.
	 */
	public constructor(protected renderer: Renderer2, protected elementRef: ElementRef) {
		super(renderer, elementRef);
	}

	/**
	 * Return true/false if the given item is already visible or if the priority (if specified) for such item is not "hidden"
	 * Otherwise, the item is considered to be hidden by default
	 * @param item - The item whose visibility will be checked
	 */
	public isItemVisible(item: StarkMinimapItemProperties): boolean {
		return this.visibleItems.indexOf(item.name) > -1;
	}

	/**
	 * Prevents click event from propagating (/closing the menu) and emits an event
	 * @param event - The event that was triggered by default (and needs to be stopped)
	 * @param item - The item that was clicked
	 */
	public handleCheckboxClick(event: Event, item: StarkMinimapItemProperties): void {
		event.stopPropagation();
		event.preventDefault();
		this.showHideItem.emit(item);
	}

	/**
	 * @ignore
	 */
	public trackItemFn(_index: number, item: StarkMinimapItemProperties): string {
		return item.name;
	}
}
