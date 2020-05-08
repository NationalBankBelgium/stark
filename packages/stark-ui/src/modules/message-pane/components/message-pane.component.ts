import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	Inject,
	Input,
	OnChanges,
	OnInit,
	Renderer2,
	SimpleChanges
} from "@angular/core";
import { Observable, of, Subject } from "rxjs";
import { delay, distinctUntilChanged, map, switchMap, take, tap } from "rxjs/operators";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import {
	starkMessagePaneAlignClassPrefix,
	starkMessagePaneCollapsedClass,
	starkMessagePaneDisplayAnimatedClass,
	starkMessagePaneDisplayedClass
} from "./message-pane.constants";
import { STARK_MESSAGE_PANE_SERVICE, StarkMessagePaneService, starkMessagePaneServiceName } from "../services/message-pane.service.intf";
import { StarkMessage } from "../../../common/message";
import { StarkMessageCollection } from "../entities";
import { AbstractStarkUiComponent } from "../../../common/classes/abstract-component";

/**
 * Type of messages that can be displayed in the message pane
 */
export type StarkMessagePaneNavItem = "" | "errors" | "warnings" | "infos";

/**
 * Type of alignment that can be set
 */
export type AlignTypes = "left" | "center" | "right";

/**
 * The default align
 */
const DEFAULT_ALIGN: AlignTypes = "right";

/**
 * @ignore
 */
const componentName = "stark-message-pane";

// FIXME: refactor the template of this component function to reduce its cyclomatic complexity
/* tslint:disable:template-cyclomatic-complexity */
/**
 * Component to display messages in a single pane grouped by level: info, errors and warnings.
 */
@Component({
	selector: "stark-message-pane",
	templateUrl: "./message-pane.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
	// We need to use host instead of @HostBinding: https://github.com/NationalBankBelgium/stark/issues/664
	host: {
		class: componentName
	}
})
export class StarkMessagePaneComponent extends AbstractStarkUiComponent implements OnInit, OnChanges {
	/**
	 * Whether the messages should be cleared on every navigation to another view/page.
	 *
	 * Default: `false`.
	 */
	@Input()
	public clearOnNavigation?: boolean;

	/**
	 * Alignment to be used: `"left"`, `"center"` or `"right"`.
	 *
	 * Default: `"right"`.
	 */
	@Input()
	public set align(value: AlignTypes) {
		this._align = value || DEFAULT_ALIGN;
	}
	public get align(): AlignTypes {
		return this._align;
	}

	/**
	 * @ignore
	 */
	private _align: "left" | "center" | "right" = DEFAULT_ALIGN;

	/**
	 * Collection of messages currently shown.
	 */
	public messageCollection: StarkMessageCollection = {
		infoMessages: [],
		warningMessages: [],
		errorMessages: []
	};

	/**
	 * Messages tab currently selected
	 */
	public currentNavItem: StarkMessagePaneNavItem = "";

	/**
	 * Total number of messages currently shown
	 */
	public totalMessages = 0;

	/**
	 * Maximum level of the messages currently shown (error, warning or info).
	 */
	public maxLevel: StarkMessagePaneNavItem = "infos";

	/**
	 * Whether the message pane is currently visible
	 */
	public isVisible = false;

	/**
	 * Delay of the animation when the messages are shown
	 */
	public showAnimationDelay = 20;

	/**
	 * Delay of the animation when the messages are hidden
	 */
	public hideAnimationDelay = 500; // the CSS animation takes 0.4 secs

	/**
	 * @ignore
	 */
	public errorMessages$!: Observable<StarkMessage[]>;

	/**
	 * @ignore
	 */
	public infoMessages$!: Observable<StarkMessage[]>;

	/**
	 * @ignore
	 */
	public warningMessages$!: Observable<StarkMessage[]>;

	/**
	 * @ignore
	 * @internal
	 */
	public hide$?: Subject<string>;

	/**
	 * Class constructor
	 * @param logger - The `StarkLoggingService` instance of the application.
	 * @param messagePaneService - The service to display/hide messages in the pane.
	 * @param renderer - Angular `Renderer2` wrapper for DOM manipulations.
	 * @param elementRef - Reference to the DOM element where this component is attached to.
	 * @param cdRef - Reference to the change detector attached to this component.
	 */
	public constructor(
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		@Inject(STARK_MESSAGE_PANE_SERVICE) public messagePaneService: StarkMessagePaneService,
		public renderer: Renderer2,
		public elementRef: ElementRef,
		protected cdRef: ChangeDetectorRef
	) {
		super(renderer, elementRef);
	}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		this.renderer.addClass(this.elementRef.nativeElement, starkMessagePaneAlignClassPrefix + this.align);

		const appMsgCollection$: Observable<StarkMessageCollection> = this.messagePaneService.getAll();

		appMsgCollection$.subscribe((msgCollection: StarkMessageCollection) => {
			this.messageCollection = msgCollection;
			this.totalMessages = this.countMessages(msgCollection);
			this.maxLevel = this.getMaxLevel(msgCollection);
			if (this.totalMessages === 0) {
				this.currentNavItem = "";
				if (this.isVisible) {
					this.hidePane();
					this.isVisible = false;
				}
			} else {
				if (!this.isVisible) {
					this.showPane();
					this.isVisible = true;
				}
			}
			this.cdRef.detectChanges(); // needed due to ChangeDetectionStrategy.OnPush in order to refresh the CSS classes
		});

		this.errorMessages$ = appMsgCollection$.pipe(
			map((msgCollection: StarkMessageCollection) => msgCollection.errorMessages),
			distinctUntilChanged()
		);

		this.infoMessages$ = appMsgCollection$.pipe(
			map((msgCollection: StarkMessageCollection) => msgCollection.infoMessages),
			distinctUntilChanged()
		);

		this.warningMessages$ = appMsgCollection$.pipe(
			map((msgCollection: StarkMessageCollection) => msgCollection.warningMessages),
			distinctUntilChanged()
		);

		super.ngOnInit();

		this.logger.debug(componentName + ": controller initialized");
	}

	/**
	 * Component lifecycle hook
	 */
	public ngOnChanges(changesObj: SimpleChanges): void {
		if (changesObj["clearOnNavigation"] && this.clearOnNavigation !== changesObj["clearOnNavigation"].previousValue) {
			this.messagePaneService.clearOnNavigation = !!this.clearOnNavigation;
		}
	}

	/**
	 * Count the number of messages by type in the collection
	 * @param messageCollection - The collection to count
	 */
	private countMessages(messageCollection: StarkMessageCollection): number {
		let msgCount = 0;

		if (messageCollection) {
			if (messageCollection.errorMessages.length > 0) {
				msgCount += messageCollection.errorMessages.length;
			}
			if (messageCollection.warningMessages.length > 0) {
				msgCount += messageCollection.warningMessages.length;
			}
			if (messageCollection.infoMessages.length > 0) {
				msgCount += messageCollection.infoMessages.length;
			}
		}

		return msgCount;
	}

	/**
	 * Retrieve the level of the message pane
	 * @param messageCollection - The collection to analyse
	 */
	private getMaxLevel(messageCollection: StarkMessageCollection): StarkMessagePaneNavItem {
		let level: StarkMessagePaneNavItem = "infos";

		if (messageCollection.warningMessages.length > 0) {
			level = "warnings";
		}
		if (messageCollection.errorMessages.length > 0) {
			level = "errors";
		}

		return level;
	}

	/**
	 * Remove one of the message
	 * @param message - The message to remove
	 */
	public removeMessage(message: StarkMessage): void {
		this.messagePaneService.remove([message]);
	}

	/**
	 * Clear all messages
	 */
	public clearAllMessages(): void {
		this.messagePaneService.clearAll();
	}

	/**
	 * Display the message pane
	 */
	public showPane(): void {
		const show$: Observable<string> = of(starkMessagePaneServiceName + ": showing pane...").pipe(
			tap(() => this.renderer.addClass(this.elementRef.nativeElement, starkMessagePaneDisplayedClass)),
			delay(this.showAnimationDelay),
			map(() => {
				this.renderer.addClass(this.elementRef.nativeElement, starkMessagePaneDisplayAnimatedClass);
				return starkMessagePaneServiceName + ": pane shown";
			})
		);

		let composedShow$: Observable<string> = show$;

		// check if the 'show' needs to wait for the 'hide' to finish, otherwise it is executed immediately
		if (this.hide$) {
			composedShow$ = this.hide$.pipe(
				switchMap(() => {
					return show$; // call the 'show' logic after the 'hide' finishes
				}),
				take(1)
			); // unsubscribe from the 'hide' in this chain (every call to the showPane() method must listen only to one emission)
		}

		composedShow$.subscribe();
	}

	/**
	 * Hide the message pane
	 */
	public hidePane(): void {
		if (!this.hide$) {
			// should wait for the panel to be hidden
			this.hide$ = new Subject<string>();
		}

		const hide$: Observable<string> = of(starkMessagePaneServiceName + ": hiding pane...").pipe(
			tap(() => this.renderer.removeClass(this.elementRef.nativeElement, starkMessagePaneDisplayAnimatedClass)),
			delay(this.hideAnimationDelay),
			map(() => {
				this.renderer.removeClass(this.elementRef.nativeElement, starkMessagePaneDisplayedClass);
				// emit result in the hide$ subject so that 'show' can continue (in case it was called)
				(<Subject<string>>this.hide$).next("pane hidden");
				// complete and remove the subject so that next calls to 'show' don't need to wait (unless 'hide' is called first)
				(<Subject<string>>this.hide$).complete();
				this.hide$ = undefined;
				return starkMessagePaneServiceName + ": pane hidden";
			})
		);

		hide$.subscribe();
	}

	/**
	 * Toggle from one item to another
	 * @param navItem - The item to navigate to
	 */
	public toggleActive(navItem: StarkMessagePaneNavItem): void {
		if (this.currentNavItem === navItem) {
			this.currentNavItem = "";
		} else {
			this.currentNavItem = navItem;
		}
	}

	/**
	 * collapse the message pane
	 */
	public collapseMessages(): void {
		this.renderer.addClass(this.elementRef.nativeElement, starkMessagePaneCollapsedClass);
	}

	/**
	 * expand the message pane
	 */
	public expandMessages(): void {
		this.renderer.removeClass(this.elementRef.nativeElement, starkMessagePaneCollapsedClass);
	}

	/**
	 * @ignore
	 */
	public trackItemFn(index: number, _item: StarkMessage): number {
		return index;
	}
}
