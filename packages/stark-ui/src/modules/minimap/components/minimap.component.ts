import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewEncapsulation } from "@angular/core";
import { StarkMinimapItemProperties } from "./item-properties.intf";
import { AbstractStarkUiComponent } from "../../../common/classes/abstract-component";

export type StarkMinimapComponentMode = "compact";

/**
 * Name of the component
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
	host: {
		class: componentName
	}
})
export class StarkMinimapComponent extends AbstractStarkUiComponent {
	/**
	 * Array of StarkMinimapItemProperties objects which define the items to display in the minimap.
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
	public showHideItem: EventEmitter<StarkMinimapItemProperties> = new EventEmitter<StarkMinimapItemProperties>();

	public constructor(protected renderer: Renderer2, protected elementRef: ElementRef) {
		super(renderer, elementRef);
	}

	/**
	 * Return true/false if the given item is already visible or if the priority (if specified) for such item is not "hidden"
	 * Otherwise, the item is considered to be hidden by default
	 */
	public isItemVisible(item: StarkMinimapItemProperties): boolean {
		return this.visibleItems.indexOf(item.name) > -1;
	}

	/**
	 * Prevents click event from propagating (/closing the menu) and emits an event
	 * @param event - the event that was triggered by default (and needs to be stopped)
	 * @param item - the item that was clicked
	 */
	public handleCheckboxClick(event: Event, item: StarkMinimapItemProperties): void {
		event.stopPropagation();
		event.preventDefault();
		this.showHideItem.emit(item);
	}

	/**
	 * @ignore
	 */
	public trackItemFn(item: StarkMinimapItemProperties): string {
		return item.name;
	}
}
