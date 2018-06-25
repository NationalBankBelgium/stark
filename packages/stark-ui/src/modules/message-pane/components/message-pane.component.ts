import { Component, ElementRef, Inject, Input, OnChanges, OnInit, Renderer2, SimpleChanges } from "@angular/core";

import { Observable, Subject, of } from "rxjs";
import { distinctUntilChanged, tap, map, delay, switchMap, take } from "rxjs/operators";

import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";

import {
	starkMessagePaneAlignClassPrefix,
	starkMessagePaneDisplayedClass,
	starkMessagePaneDisplayAnimatedClass,
	starkMessagePaneCollapsedClass
} from "./message-pane.constants";

import { STARK_MESSAGE_PANE_SERVICE, StarkMessagePaneService } from "../services/message-pane.service.intf";
import { StarkMessage } from "../../../common/message";
import { StarkMessageCollection } from "../entities";
import { AbstractStarkUiComponent } from "../../../common/classes/abstract-component";

export type StarkMessagePaneNavItem = "" | "errors" | "warnings" | "infos";

/**
 * The name of the component
 */
const componentName: string = "stark-message-pane";

// FIXME: refactor the template of this component function to reduce its cyclomatic complexity
/* tslint:disable:template-cyclomatic-complexity */

/**
 * Component to display messages in a single pane grouped by level: info, errors and warnings.
 * @param clearOnNavigation - Whether the messages should be cleared on every navigation to another view/page.
 * Default: false. (optional)
 *
 * @param align - Alignment to be used: "left", "center" or "right". Default: "right"
 */
@Component({
	selector: "stark-message-pane",
	templateUrl: "./message-pane.component.html",
	// We need to use host instead of @HostBinding: https://github.com/NationalBankBelgium/stark/issues/664
	host: {
		class: componentName
	}
})
export class StarkMessagePaneComponent extends AbstractStarkUiComponent implements OnInit, OnChanges {
	@Input()
	public clearOnNavigation?: boolean;
	@Input()
	public align?: "left" | "center" | "right";

	public messageCollection: StarkMessageCollection = {
		infoMessages: [],
		warningMessages: [],
		errorMessages: []
	};
	public currentNavItem: StarkMessagePaneNavItem;
	public errorMessages$: Observable<StarkMessage[]>;
	public infoMessages$: Observable<StarkMessage[]>;
	public warningMessages$: Observable<StarkMessage[]>;
	public totalMessages: number;
	public maxLevel: StarkMessagePaneNavItem;

	public rootElement: HTMLElement;
	public isVisible: boolean;

	public showAnimationDelay: number = 20;
	public hideAnimationDelay: number = 500; // the CSS animation takes 0.4 secs
	public hide$?: Subject<string>;

	public constructor(
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		@Inject(STARK_MESSAGE_PANE_SERVICE) public messagePaneService: StarkMessagePaneService,
		protected renderer: Renderer2,
		protected elementRef: ElementRef
	) {
		super(renderer, elementRef);
	}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		this.rootElement = <HTMLElement>this.elementRef.nativeElement;

		if (!this.align) {
			this.align = "right";
		}
		this.rootElement.classList.add(starkMessagePaneAlignClassPrefix + this.align);
		this.currentNavItem = "";
		this.isVisible = false;

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
	 * @param messageCollection - the collection to count
	 */
	private countMessages(messageCollection: StarkMessageCollection): number {
		let msgCount: number = 0;

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
	 * @param messageCollection - the collection to analyse
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
		const show$: Observable<string> = of(STARK_MESSAGE_PANE_SERVICE + ": showing pane...").pipe(
			tap(() => this.rootElement.classList.add(starkMessagePaneDisplayedClass)),
			delay(this.showAnimationDelay),
			map(() => {
				this.rootElement.classList.add(starkMessagePaneDisplayAnimatedClass);
				return STARK_MESSAGE_PANE_SERVICE + ": pane shown";
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

		const hide$: Observable<string> = of(STARK_MESSAGE_PANE_SERVICE + ": hiding pane...").pipe(
			tap(() => this.rootElement.classList.remove(starkMessagePaneDisplayAnimatedClass)),
			delay(this.hideAnimationDelay),
			map(() => {
				this.rootElement.classList.remove(starkMessagePaneDisplayedClass);
				// emit result in the hide$ subject so that 'show' can continue (in case it was called)
				(<Subject<string>>this.hide$).next("pane hidden");
				// complete and remove the subject so that next calls to 'show' don't need to wait (unless 'hide' is called first)
				(<Subject<string>>this.hide$).complete();
				this.hide$ = undefined;
				return STARK_MESSAGE_PANE_SERVICE + ": pane hidden";
			})
		);

		hide$.subscribe();
	}

	/**
	 * Toggle from one item to another
	 * @param navItem - the item to navigate to
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
		this.rootElement.classList.add(starkMessagePaneCollapsedClass);
	}

	/**
	 * expand the message pane
	 */
	public expandMessages(): void {
		this.rootElement.classList.remove(starkMessagePaneCollapsedClass);
	}

	/**
	 * @ignore
	 */
	public trackItemFn(_index: number, item: StarkMessage): string {
		return item.id;
	}
}
