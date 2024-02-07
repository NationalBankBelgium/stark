import { AfterViewInit, Component, Input, OnDestroy, OnInit } from "@angular/core";
import { fromEvent, Subject } from "rxjs";
import { debounceTime, takeUntil } from "rxjs/operators";
import { TableOfContentLink } from "./table-of-content-link.intf";

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: "table-of-contents",
	templateUrl: "./table-of-contents.component.html"
})
/**
 * The table of contents component, freely inspired from:
 * @see https://github.com/angular/material.angular.io/tree/master/src/app/shared/table-of-contents
 */
export class TableOfContentsComponent implements OnInit, AfterViewInit, OnDestroy {
	public links: TableOfContentLink[] = [];

	/**
	 * The classes of the titles you want to use in your table of contents
	 */
	@Input()
	public headerSelectors?: string;

	private _scrollContainer: Window = window;
	private _destroyed: Subject<void> = new Subject();
	private _urlFragment = "";

	public ngOnInit(): void {
		this.links = this.createLinks();

		// On init, the sidenav content element doesn't yet exist, so it's not possible
		// to subscribe to its scroll event until next tick (when it does exist).
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		Promise.resolve()
			.then(() => {
				if (this._scrollContainer) {
					fromEvent(this._scrollContainer, "scroll")
						.pipe(takeUntil(this._destroyed), debounceTime(10))
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
	 * Gets the scrollOffset of the container.
	 * Basically, this will return the position on the screen where the user is located.
	 */
	private getScrollOffset(): number {
		let top = 0;
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

		if (!this.headerSelectors) {
			return links;
		}
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
		const max: number = document.documentElement.scrollHeight;
		const pos: number = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
		if (pos === max) {
			this.links[linksCounter].active = true;
			for (let i = 0; i < linksCounter; i++) {
				this.links[i].active = false;
			}
		} else {
			this.links[linksCounter].active = false;
			for (let i = 0; i < linksCounter; i++) {
				this.links[i].active = this.isLinkActive(this.links[i], this.links[i + 1]);
			}
		}
	}

	/**
	 * This method will check, thanks to the user's position on a screen, if a link is active or not.
	 * If the value of scrollOffset is higher than the top of the current link (so, below the current link)
	 * and lower than the top of tne next link (so, above the next link), it means that the link is active.
	 * @param currentLink - the Link we are analysing
	 * @param nextLink - the Link that follows the currentLink
	 * @returns - if the link is active (true) or not (false)
	 * FIXME: No longer works see https://github.com/NationalBankBelgium/stark/issues/1172
	 */
	private isLinkActive(currentLink: TableOfContentLink, nextLink: TableOfContentLink): boolean {
		// A link is considered active if the page is scrolled passed the anchor without also
		// being scrolled passed the next link
		const scrollOffset: number = this.getScrollOffset();
		return scrollOffset >= currentLink.top && (!nextLink || nextLink.top > scrollOffset);
	}

	/**
	 * 	Hacky way to prevent redirect to homepage when clicking an anchor.
	 * 	@ignore
	 */
	public getHref(link: TableOfContentLink): string {
		const { origin, pathname }: { origin: string; pathname: string } = window.location;
		return `${origin}${pathname}#${link.id}`;
	}

	/**
	 * @ignore
	 */
	public trackItem(_index: number, item: TableOfContentLink): string {
		return item.id;
	}
}
