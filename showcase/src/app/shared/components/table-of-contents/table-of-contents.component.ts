import { AfterViewInit, Component, Input, OnDestroy, OnInit } from "@angular/core";
import { fromEvent, Subject } from "rxjs";
import { debounceTime, takeUntil } from "rxjs/operators";
import { StarkAction } from "@nationalbankbelgium/stark-ui";
import { TableOfContentLink } from "./table-of-content-link.intf";

@Component({
	selector: "table-of-contents",
	templateUrl: "./table-of-contents.component.html"
})
/**
 * The table of contents component, freely inspired from :
 * @link https://github.com/angular/material.angular.io/tree/master/src/app/shared/table-of-contents
 */
export class TableOfContentsComponent implements OnInit, AfterViewInit, OnDestroy {
	public links: TableOfContentLink[] = [];

	/**
	 * The classes of the titles you want to use in your table of contents
	 */
	@Input()
	public headerSelectors: string;

	private _scrollContainer: Window;
	private _destroyed: Subject<any> = new Subject();
	private _urlFragment: string = "";

	public constructor() {
		//
	}

	public ngOnInit(): void {
		this.links = this.createLinks();

		// On init, the sidenav content element doesn't yet exist, so it's not possible
		// to subscribe to its scroll event until next tick (when it does exist).
		Promise.resolve()
			.then(() => {
				this._scrollContainer = window;
				if (this._scrollContainer) {
					fromEvent(this._scrollContainer, "scroll")
						.pipe(
							takeUntil(this._destroyed),
							debounceTime(10)
						)
						.subscribe(() => {
							this.onScroll();
						});
				}
			})
			.catch();
	}

	public ngAfterViewInit(): void {
		this.updateScrollPosition();
	}

	public ngOnDestroy(): void {
		this._destroyed.next();
	}

	public updateScrollPosition(): void {
		this.links = this.createLinks();
		const target: HTMLElement | null = document.getElementById(this._urlFragment);
		if (target) {
			target.scrollIntoView();
		}
	}

	/**
	 * Gets the scrolloffset of the container.
	 * Basically, this will return the position on the screen where the user is located.
	 */
	private getScrollOffset(): number {
		let top: number = 0;
		if (typeof this._scrollContainer.pageYOffset !== "undefined") {
			top = top + this._scrollContainer.pageYOffset;
		}
		return top;
	}

	/**
	 * This method will build a list of links according to the classes the user put in headerSelectors.
	 * @returns a list of links
	 */
	public createLinks(): TableOfContentLink[] {
		const links: TableOfContentLink[] = [];
		const headings: HTMLElement[] = Array.from(document.querySelectorAll(this.headerSelectors));

		for (const heading of headings) {
			// remove the 'link' icon name from the inner text
			const name: string = heading.innerText.trim().replace(/^link/, "");
			const top: number = heading.offsetTop - 20;
			links.push({
				name,
				type: heading.tagName.toLowerCase(),
				top: top,
				id: heading.id,
				active: false
			});
		}
		return links;
	}

	/**
	 * This methods checks if each link is active or not
	 * we have to do a trick here for the last link of the page.
	 * We calculate the position on the screen as well as the lowest position of the page.
	 * If they match, it means that we are at the bottom of the page and that the last link of the table should be active, and the one
	 * before it should therefore not.
	 *
	 * When we scroll again on the page, the last link is set to inactive again.
	 * This is used when the offset position is lower than the top of the last link on the page (if that so, that link could never
	 * be set to active).
	 */
	private onScroll(): void {
		const linksCounter: number = this.links.length - 1;
		const max: number = (<HTMLElement>document.documentElement).scrollHeight;
		const pos: number =
			((<HTMLElement>document.documentElement).scrollTop || document.body.scrollTop) +
			(<HTMLElement>document.documentElement).offsetHeight;
		if (pos === max) {
			this.links[linksCounter].active = true;
			for (let i: number = 0; i < linksCounter; i++) {
				this.links[i].active = false;
			}
		} else {
			this.links[linksCounter].active = false;
			for (let i: number = 0; i < linksCounter; i++) {
				this.links[i].active = this.isLinkActive(this.links[i], this.links[i + 1]);
			}
		}
	}

	/**
	 * This method will check, thanks to the user's position on a screen, if a link is active or not.
	 * If the value of scrolloffset is higher than the top of the currentlink (so, below the currentLink)
	 * and lower than the top of tne nextlinkg (so, above the nextLink), it means that the link is active.
	 * @param currentLink - the Link we are analysing
	 * @param nextLink - the Link that follows the currentLink
	 * @returns - if the link is active (true) or not (false)
	 */
	private isLinkActive(currentLink: TableOfContentLink, nextLink: TableOfContentLink): boolean {
		// A link is considered active if the page is scrolled passed the anchor without also
		// being scrolled passed the next link
		const scrollOffset: number = this.getScrollOffset();
		return scrollOffset >= currentLink.top && (!nextLink || nextLink.top > scrollOffset);
	}

	/**
	 * Method used to scroll to a link directly.
	 * We cannot use the classical href with id's method because it would logoff the user from the application.
	 * @param anchor - the title to scroll to
	 */
	public scrollToAnchor(anchor: string): void {
		const anchorPosition: number = (<HTMLElement>document.querySelector(anchor)).offsetTop;
		window.scrollTo(0, anchorPosition);
	}

	/**
	 * @ignore
	 */
	public trackItem(_index: number, item: StarkAction): string {
		return item.id;
	}
}
