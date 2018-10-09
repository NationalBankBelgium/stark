import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import {
	ApplicationRef,
	Component,
	ElementRef,
	EventEmitter,
	Inject,
	Input,
	OnDestroy,
	OnInit,
	Output,
	Renderer2,
	ViewEncapsulation
} from "@angular/core";
import { ItemVisibility, StarkDOMUtil, StarkMinimapItemProperties } from "@nationalbankbelgium/stark-ui";
import { AbstractStarkUiComponent } from "../../../common/classes/abstract-component";

export type StarkMinimapComponentMode = "compact";

/**
 * Name of the component
 */
const componentName: string = "stark-minimap";

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
export class StarkMinimapComponent extends AbstractStarkUiComponent implements OnInit, OnDestroy {
	/**
	 * Array of StarkMinimapItemProperties objects which define the items to display in the minimap.
	 */
	@Input()
	public items: StarkMinimapItemProperties[];

	/**
	 * Array of names of the items that are visible.
	 */
	@Input()
	public visibleItems: string[];

	/**
	 * the minimap mode we want to display
	 */
	@Input()
	public mode?: StarkMinimapComponentMode;

	/**
	 * Output that will emit the selected element to be shown/hidden
	 */
	@Output()
	public showHideItem: EventEmitter<ItemVisibility> = new EventEmitter<ItemVisibility>();

	public windowClickHandler: EventListener;
	public isDisplayedMenu: boolean;

	public constructor(
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		protected renderer: Renderer2,
		protected elementRef: ElementRef,
		protected applicationRef: ApplicationRef
	) {
		super(renderer, elementRef);
	}

	public ngOnInit(): void {
		super.ngOnInit();
		this.isDisplayedMenu = false;
		this.attachWindowClickHandler();
	}

	public ngOnChanges(changes: any): void {
		if (changes["visibleItems"]) {
			console.log("----------- MINIMAP visibleItems", changes["visibleItems"]);
		}
	}

	/**
	 * Component lifecycle hook
	 */
	public ngOnDestroy(): void {
		this.logger.debug(componentName + ": removing clickHandler");
		this.removeWindowClickHandler();
	}

	/**
	 * Retrieve the label of an item
	 * @param itemToHandle - the item whose label we want to retrieve
	 * @returns the label of the item
	 */
	public getItemLabel(itemToHandle: StarkMinimapItemProperties): string {
		if (itemToHandle.label) {
			return itemToHandle.label;
		}

		return itemToHandle.name;
	}

	/**
	 * Attach a handler when a click is performed on the window
	 */
	public attachWindowClickHandler(): void {
		this.windowClickHandler = (event: Event) => {
			if (this.isDisplayedMenu) {
				const parentElement: Element | undefined = StarkDOMUtil.searchParentElementByClass(
					<Element>event.target,
					"stark-minimap-dropdown-toggle"
				);

				if (!parentElement) {
					this.toggleDropdownMenu();
					this.applicationRef.tick();
				}
			}
		};

		window.addEventListener("click", this.windowClickHandler);
	}

	/**
	 * remove the handler attached to a window
	 */
	public removeWindowClickHandler(): void {
		window.removeEventListener("click", this.windowClickHandler);
	}

	/**
	 * Return true/false if the given item is already visible or if the priority (if specified) for such item is not "hidden"
	 * Otherwise, the item is considered to be hidden by default
	 */
	public isItemVisible(itemToHandle: StarkMinimapItemProperties): boolean {
		return this.visibleItems instanceof Array ? this.visibleItems.indexOf(itemToHandle.name) > -1 : false;
	}

	/**
	 * Display / Hide the dropdown menu
	 */
	public toggleDropdownMenu(): void {
		this.isDisplayedMenu = !this.isDisplayedMenu;
	}

	/**
	 * triggers the show/hide event on an item
	 * @param itemToHandle : item - the item to show/hide
	 */
	public triggerShowHideItem(itemToHandle: StarkMinimapItemProperties): void {
		const visibleItem: ItemVisibility = {
			isVisible: !this.isItemVisible(itemToHandle),
			item: itemToHandle
		};
		this.showHideItem.emit(visibleItem);
	}

	/**
	 * @ignore
	 */
	public trackItemFn(_itemToHandle: any): string {
		// FIXME: cannot call areSimpleTypes() from the component since this track function gets no context
		return _itemToHandle;
	}
}
