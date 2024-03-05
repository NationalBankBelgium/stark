import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { MatLegacyInputModule as MatInputModule } from "@angular/material/legacy-input";
import { MatLegacyMenuModule as MatMenuModule } from "@angular/material/legacy-menu";
import { MatLegacyPaginatorModule as MatPaginatorModule } from "@angular/material/legacy-paginator";
import { MatLegacyTooltipModule as MatTooltipModule } from "@angular/material/legacy-tooltip";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MatIconModule } from "@angular/material/icon";
import { MatIconTestingModule } from "@angular/material/icon/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { Component, DebugElement, ViewChild } from "@angular/core";
import { By } from "@angular/platform-browser";
import { TranslateModule } from "@ngx-translate/core";
import { STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import { Observer } from "rxjs";
import { StarkPaginationComponent } from "./pagination.component";
import { StarkPaginateEvent } from "./paginate-event.intf";
import { StarkPaginationConfig } from "./pagination-config.intf";
import { StarkDropdownComponent, StarkDropdownModule } from "@nationalbankbelgium/stark-ui/src/modules/dropdown";
import { StarkRestrictInputDirectiveModule } from "@nationalbankbelgium/stark-ui/src/modules/restrict-input-directive";
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

@Component({
	selector: `host-component`,
	template: ` <stark-pagination [htmlSuffixId]="htmlSuffixId" [paginationConfig]="paginationConfig"></stark-pagination> `
})
class TestHostComponent {
	@ViewChild(StarkPaginationComponent, { static: true })
	public paginationComponent!: StarkPaginationComponent;

	public htmlSuffixId?: string;
	public paginationConfig?: StarkPaginationConfig;
}

describe("PaginationComponent", () => {
	let hostComponent: TestHostComponent;
	let hostFixture: ComponentFixture<TestHostComponent>;
	let component: StarkPaginationComponent;

	const paginationConfig: StarkPaginationConfig = {
		page: 2,
		itemsPerPage: 4,
		itemsPerPageOptions: [4, 8, 12],
		totalItems: 6,
		isExtended: true
	};

	const htmlSuffixId = "testHtmlId";
	const currentPagePrefix = "current-page-";
	const itemsPerPagePrefix = "items-per-page-";
	const pageNumbersSelector = "li.page-numbers";
	const totalPagesSelector = "span.total-pages";

	const assertPageNavSelection: Function = (paginationElement: DebugElement, selectedOption: string): void => {
		const pageNavElement: DebugElement = paginationElement.query(By.css("ul"));
		const pageNavOptionElements: DebugElement[] = pageNavElement.queryAll(By.css("li"));

		for (const pageNavOption of pageNavOptionElements) {
			if (pageNavOption.nativeElement.textContent === selectedOption) {
				expect(pageNavOption.classes["active"]).toBe(true);
			} else {
				expect(pageNavOption.classes["active"]).toBeFalsy(); // can be undefined or false
			}
		}
	};

	const changeInputValueAndPressEnter: Function = (rootElement: DebugElement, value: string): void => {
		const querySelector = "div.pagination-enter-page input";
		const pageSelectorInput: DebugElement = rootElement.query(By.css(querySelector));
		const nativeInputElement: HTMLInputElement = <HTMLInputElement>pageSelectorInput.nativeElement;

		nativeInputElement.value = value;
		// more verbose way to create and trigger an event (the only way it works in IE)
		// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
		const inputEvent: Event = document.createEvent("Event");
		inputEvent.initEvent("input", true, true);
		nativeInputElement.dispatchEvent(inputEvent); // to trigger the input change on IE

		const changeEvent: Event = document.createEvent("Event");
		changeEvent.initEvent("change", true, true);
		pageSelectorInput.triggerEventHandler("change", changeEvent);

		// key up
		const keyupEvent: Event = document.createEvent("Event");
		keyupEvent.initEvent("keyup", true, true);
		keyupEvent["key"] = "Enter";
		nativeInputElement.dispatchEvent(keyupEvent);
	};

	const triggerClick: Function = (element: DebugElement): void => {
		// more verbose way to create and trigger an event (the only way it works in IE)
		// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
		const clickEvent: Event = document.createEvent("Event");
		clickEvent.initEvent("click", true, true);
		(<HTMLElement>element.nativeElement).dispatchEvent(clickEvent);
	};

	const assertPageInputSelection: Function = (rootElement: DebugElement, selectedOption: string): void => {
		const querySelector = "div.pagination-enter-page input";
		const pageSelectorInput: DebugElement = rootElement.query(By.css(querySelector));
		expect(pageSelectorInput.properties["value"].toString()).toBe(selectedOption);
	};

	beforeEach(waitForAsync(() =>
		TestBed.configureTestingModule({
			imports: [
				FormsModule,
				MatButtonModule,
				MatIconModule,
				MatIconTestingModule,
				MatInputModule,
				MatMenuModule,
				MatPaginatorModule,
				MatTooltipModule,
				NoopAnimationsModule,
				StarkDropdownModule,
				StarkRestrictInputDirectiveModule,
				TranslateModule.forRoot()
			],
			declarations: [StarkPaginationComponent, TestHostComponent],
			providers: [{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() }]
		}).compileComponents()));

	beforeEach(() => {
		hostFixture = TestBed.createComponent(TestHostComponent);
		hostComponent = hostFixture.componentInstance;
		hostComponent.htmlSuffixId = htmlSuffixId;
		hostFixture.detectChanges();

		component = hostComponent.paginationComponent;
	});

	describe("on initialization", () => {
		it("should set internal component properties", () => {
			expect(hostFixture).toBeDefined();
			expect(component).toBeDefined();

			expect(component.logger).not.toBeNull();
			expect(component.logger).toBeDefined();
		});

		it("should NOT have any inputs set", () => {
			expect(component.htmlSuffixId).toBe(htmlSuffixId);
			expect(component.mode).toBeUndefined();
			expect(component.paginationConfig).toBeDefined();
		});

		it("should render the appropriate content in normal mode", () => {
			hostComponent.paginationConfig = {
				page: 2,
				itemsPerPage: 4,
				itemsPerPageOptions: [4, 8, 12],
				totalItems: 10,
				isExtended: false,
				pageNavIsPresent: true,
				pageInputIsPresent: true,
				itemsPerPageIsPresent: true
			};
			hostFixture.detectChanges();

			const pageNavElement: DebugElement = hostFixture.debugElement.query(By.css("ul"));
			expect(pageNavElement).toBeDefined();
			expect(pageNavElement.nativeElement.innerHTML).toMatch('<li.* aria-label="Previous"');
			const numberElements: DebugElement[] = pageNavElement.queryAll(By.css(pageNumbersSelector));
			expect(numberElements.length).toBe(0);
			expect(pageNavElement.nativeElement.innerHTML).toMatch('<li.* aria-label="Next"');

			// Verify pageSelector
			const pageSelector: DebugElement = hostFixture.debugElement.query(By.css("div.pagination-enter-page"));

			const pageSelectorInput: DebugElement = pageSelector.query(By.css("input"));
			expect(pageSelectorInput.properties["id"]).toBe(currentPagePrefix + htmlSuffixId);
			/// expect(pageSelectorInput.attributes["ngModel"]).toBe("paginationInput"); // FIXME: ngModel not included in the element
			expect(pageSelectorInput.attributes["starkRestrictInput"]).toBe("\\d");
			const pageSelectorTotalPages: DebugElement = pageSelector.query(By.css(totalPagesSelector));
			expect(pageSelectorTotalPages.nativeElement.innerHTML).toBe("3");

			// Verify itemsPerPageSelector dropdown
			const itemsPerPageSelector: DebugElement = hostFixture.debugElement.query(By.directive(StarkDropdownComponent));

			// bindings can be checked via the ng-reflect-xxxx attributes
			expect(itemsPerPageSelector.attributes["ng-reflect-options"]).toBe(
				(<number[]>component.paginationConfig.itemsPerPageOptions).join(",")
			);
			expect(itemsPerPageSelector.attributes["ng-reflect-value"]).toBe((<number>component.paginationConfig.itemsPerPage).toString());
			expect(itemsPerPageSelector.attributes["ng-reflect-dropdown-id"]).toBe(itemsPerPagePrefix + htmlSuffixId);
			expect(itemsPerPageSelector.attributes["ng-reflect-dropdown-name"]).toBe(itemsPerPagePrefix + htmlSuffixId);
			/// expect(itemsPerPageSelector.attr("header")).toBe("STARK.PAGINATION.ITEMS_PER_PAGE"); // TODO add a header to the itemsPerPage dropdown
		});

		it("should render the appropriate content in extended mode", () => {
			hostComponent.paginationConfig = {
				page: 2,
				itemsPerPage: 4,
				itemsPerPageOptions: [4, 8, 12],
				totalItems: 10,
				isExtended: true,
				pageNavIsPresent: true,
				pageInputIsPresent: true,
				itemsPerPageIsPresent: true
			};
			hostFixture.detectChanges();

			const pageNavElement: DebugElement = hostFixture.debugElement.query(By.css("ul"));
			expect(pageNavElement).toBeDefined();
			expect(pageNavElement.nativeElement.innerHTML).toMatch('<li.* aria-label="Previous"');
			const numberElements: DebugElement[] = pageNavElement.queryAll(By.css(pageNumbersSelector));
			expect(numberElements.length).toBe(3);
			expect(numberElements[0].nativeElement.textContent).toBe("1");
			expect(numberElements[1].nativeElement.textContent).toBe("2");
			expect(numberElements[2].nativeElement.textContent).toBe("3");
			assertPageNavSelection(hostFixture.debugElement.childNodes[0], "2");
			expect(pageNavElement.nativeElement.innerHTML).toMatch('<li.* aria-label="Next"');

			// Verify pageSelector
			const pageSelector: DebugElement = hostFixture.debugElement.query(By.css("div.pagination-enter-page"));

			const pageSelectorInput: DebugElement = pageSelector.query(By.css("input"));
			expect(pageSelectorInput.properties["id"]).toBe(currentPagePrefix + htmlSuffixId);
			/// expect(pageSelectorInput.attributes["ngModel"]).toBe("paginationInput"); // FIXME: ngModel not included in the element
			expect(pageSelectorInput.attributes["starkRestrictInput"]).toBe("\\d");
			const pageSelectorTotalPages: DebugElement = pageSelector.query(By.css(totalPagesSelector));
			expect(pageSelectorTotalPages.nativeElement.innerHTML).toBe("3");

			// Verify itemsPerPageSelector dropdown
			const itemsPerPageSelector: DebugElement = hostFixture.debugElement.query(By.directive(StarkDropdownComponent));

			// bindings can be checked via the ng-reflect-xxxx attributes
			expect(itemsPerPageSelector.attributes["ng-reflect-options"]).toBe(
				(<number[]>component.paginationConfig.itemsPerPageOptions).join(",")
			);
			expect(itemsPerPageSelector.attributes["ng-reflect-value"]).toBe((<number>component.paginationConfig.itemsPerPage).toString());
			expect(itemsPerPageSelector.attributes["ng-reflect-dropdown-id"]).toBe(itemsPerPagePrefix + htmlSuffixId);
			expect(itemsPerPageSelector.attributes["ng-reflect-dropdown-name"]).toBe(itemsPerPagePrefix + htmlSuffixId);
			/// expect(itemsPerPageSelector.attr("header")).toBe("STARK.PAGINATION.ITEMS_PER_PAGE"); // TODO add a header to the itemsPerPage dropdown
		});
	});

	describe("isZero", () => {
		it("should return TRUE if passed number is zero (number)", () => {
			const isZero: boolean = component.isZero(0);
			expect(isZero).toBe(true);
		});

		it("should return TRUE if passed number is zero (string)", () => {
			const isZero: boolean = component.isZero("0");
			expect(isZero).toBe(true);
		});

		it("should return FALSE if passed number is not zero (number)", () => {
			const isZero: boolean = component.isZero(1);
			expect(isZero).toBe(false);
		});

		it("should return FALSE if passed number is not zero (string)", () => {
			const isZero: boolean = component.isZero("1");
			expect(isZero).toBe(false);
		});
	});

	describe("hasNext", () => {
		beforeEach(() => {
			component.paginationConfig = {
				itemsPerPage: 4,
				totalItems: 6
			};
		});

		it("should return TRUE if there's a page after the current", () => {
			component.paginationConfig.page = 1;

			const hasNext: boolean = component.hasNext();
			expect(hasNext).toBe(true);
		});

		it("should return FALSE if there's not a page after the current", () => {
			component.paginationConfig.page = 2;

			const hasNext: boolean = component.hasNext();
			expect(hasNext).toBe(false);
		});
	});

	describe("hasPrevious", () => {
		beforeEach(() => {
			component.paginationConfig = {
				itemsPerPage: 4,
				totalItems: 6
			};
		});

		it("should return TRUE if there's a page before the current", () => {
			component.paginationConfig.page = 2;

			const hasPrevious: boolean = component.hasPrevious();
			expect(hasPrevious).toBe(true);
		});

		it("should return FALSE if there's not a page before the current", () => {
			component.paginationConfig.page = 1;

			const hasPrevious: boolean = component.hasPrevious();
			expect(hasPrevious).toBe(false);
		});
	});

	describe("getTotalPages", () => {
		beforeEach(() => {
			component.paginationConfig = {
				itemsPerPage: 4,
				totalItems: 6
			};
		});

		it("should return the number of pages based on number of items per page", () => {
			component.paginationConfig.itemsPerPage = 4;
			component.paginationConfig.totalItems = 10;

			const pages: number = component.getTotalPages();
			expect(pages).toBe(3);
		});

		it("should return the number of pages when itemsPerPages equals zero", () => {
			component.paginationConfig.itemsPerPage = 0;
			component.paginationConfig.totalItems = 10;

			const pages: number = component.getTotalPages();
			expect(pages).toBe(10);
		});

		it("should return NaN if there's not totalItems value", () => {
			component.paginationConfig.itemsPerPage = 4;
			component.paginationConfig.totalItems = undefined;

			const pages: number = component.getTotalPages();
			expect(pages).toBeNaN();
		});
	});

	describe("goToLast", () => {
		beforeEach(() => {
			component.paginationConfig = {
				itemsPerPage: 4,
				totalItems: 9
			};
		});

		it("should not increment the page if the current page is the last", () => {
			component.paginationConfig.page = 3;

			component.goToLast();
			expect(component.paginationConfig.page).toBe(3);
		});

		it("should go to the last page if the current page is not the last", () => {
			component.paginationConfig.page = 1;

			component.goToLast();
			expect(component.paginationConfig.page).toBe(3);
		});

		it("should call onChangePagination if the current page is not the last", () => {
			component.paginationConfig.page = 1;

			spyOn(component, "onChangePagination");
			component.goToLast();
			expect(component.onChangePagination).toHaveBeenCalledTimes(1);
		});
	});

	describe("goToNext", () => {
		beforeEach(() => {
			component.paginationConfig = {
				itemsPerPage: 4,
				totalItems: 9
			};
		});

		it("should not increment the page if the current page is the last", () => {
			component.paginationConfig.page = 3;

			component.goToNext();
			expect(component.paginationConfig.page).toBe(3);
		});

		it("should increment the page if the current page is not the last", () => {
			component.paginationConfig.page = 1;

			component.goToNext();
			expect(component.paginationConfig.page).toBe(2);
		});

		it("should call onChangePagination if the current page is not the last", () => {
			component.paginationConfig.page = 1;

			spyOn(component, "onChangePagination");
			component.goToNext();
			expect(component.onChangePagination).toHaveBeenCalledTimes(1);
		});
	});

	describe("goToPrevious", () => {
		beforeEach(() => {
			component.paginationConfig = {
				itemsPerPage: 4,
				totalItems: 9
			};
		});

		it("should not decrement the page if the current page is the first", () => {
			component.paginationConfig.page = 1;

			component.goToPrevious();
			expect(component.paginationConfig.page).toBe(1);
		});

		it("should decrement the page if the current page is not the first", () => {
			component.paginationConfig.page = 2;

			component.goToPrevious();
			expect(component.paginationConfig.page).toBe(1);
		});

		it("should call onChangePagination if the current page is not the first", () => {
			component.paginationConfig.page = 2;

			spyOn(component, "onChangePagination");
			component.goToPrevious();
			expect(component.onChangePagination).toHaveBeenCalledTimes(1);
		});
	});

	describe("goToFirst", () => {
		beforeEach(() => {
			component.paginationConfig = {
				itemsPerPage: 4,
				totalItems: 9
			};
		});

		it("should not decrement the page if the current page is the first", () => {
			component.paginationConfig.page = 1;

			component.goToFirst();
			expect(component.paginationConfig.page).toBe(1);
		});

		it("should go to the first page if the current page is not the first", () => {
			component.paginationConfig.page = 3;

			component.goToFirst();
			expect(component.paginationConfig.page).toBe(1);
		});

		it("should call onChangePagination if the current page is not the first", () => {
			component.paginationConfig.page = 2;

			spyOn(component, "onChangePagination");
			component.goToFirst();
			expect(component.onChangePagination).toHaveBeenCalledTimes(1);
		});
	});

	describe("setPageNumbers", () => {
		beforeEach(() => {
			component.paginationConfig = {
				itemsPerPage: 4,
				itemsPerPageOptions: [4, 8, 12]
			};
		});

		it("should generate pageNumbers with 1-2-3", () => {
			component.paginationConfig.page = 2;
			component.paginationConfig.totalItems = 10;

			component.setPageNumbers();
			expect(component.pageNumbers).toEqual([1, 2, 3]);
		});

		it("should generate pageNumbers with 1-2-3-4-5", () => {
			component.paginationConfig.page = 2;
			component.paginationConfig.totalItems = 20;

			component.setPageNumbers();
			expect(component.pageNumbers).toEqual([1, 2, 3, 4, 5]);
		});

		it("should generate pageNumbers with 1-2-3-...-6", () => {
			component.paginationConfig.page = 1;
			component.paginationConfig.totalItems = 21;

			component.setPageNumbers();
			expect(component.pageNumbers).toEqual([1, 2, 3, "...", 6]);
		});

		it("should generate pageNumbers with 1-2-3-...-6 when the current page is the second", () => {
			component.paginationConfig.page = 2;
			component.paginationConfig.totalItems = 21;

			component.setPageNumbers();
			expect(component.pageNumbers).toEqual([1, 2, 3, "...", 6]);
		});

		it("should generate pageNumbers with 1-...-4-5-6 when the current page is the before last", () => {
			component.paginationConfig.page = 5;
			component.paginationConfig.totalItems = 21;

			component.setPageNumbers();
			expect(component.pageNumbers).toEqual([1, "...", 4, 5, 6]);
		});

		it("should generate pageNumbers with 1-...-5-6 when the current page is the last", () => {
			component.paginationConfig.page = 6;
			component.paginationConfig.totalItems = 21;

			component.setPageNumbers();
			expect(component.pageNumbers).toEqual([1, 2, 3, "...", 6]);
		});

		it("should generate pageNumbers with 1-...-4-5-6 when the current page is lastPage-2", () => {
			component.paginationConfig.page = 4;
			component.paginationConfig.totalItems = 21;

			component.setPageNumbers();
			expect(component.pageNumbers).toEqual([1, "...", 4, 5, 6]);
		});

		it("should generate pageNumbers with 1-...-4-...-7 when the current page is the first", () => {
			component.paginationConfig.page = 1;
			component.paginationConfig.totalItems = 28;

			component.setPageNumbers();
			expect(component.pageNumbers).toEqual([1, "...", 4, "...", 7]);
		});

		it("should generate pageNumbers with 1-...-4-...-7 when the current page is in the middle", () => {
			component.paginationConfig.page = 4;
			component.paginationConfig.totalItems = 28;

			component.setPageNumbers();
			expect(component.pageNumbers).toEqual([1, "...", 4, "...", 7]);
		});

		it("should generate pageNumbers with 1-...-5-6-7 if the current page is the before last", () => {
			component.paginationConfig.page = 6;
			component.paginationConfig.totalItems = 28;

			component.setPageNumbers();
			expect(component.pageNumbers).toEqual([1, "...", 5, 6, 7]);
		});

		it("should generate pageNumbers with 1-...-4-...-7 if the current page is the last", () => {
			component.paginationConfig.page = 7;
			component.paginationConfig.totalItems = 28;

			component.setPageNumbers();
			expect(component.pageNumbers).toEqual([1, "...", 4, "...", 7]);
		});
	});

	describe("goToPage", () => {
		beforeEach(() => {
			component.paginationConfig = {
				itemsPerPage: 4,
				page: 1,
				totalItems: 10
			};
		});

		it("should not change page when page is ...", () => {
			component.goToPage("...");
			expect(component.paginationConfig.page).toBe(1);
		});

		it("should not call onChangePagination function when page is ...", () => {
			spyOn(component, "onChangePagination");
			component.goToPage("...");
			expect(component.onChangePagination).not.toHaveBeenCalled();
		});

		it("should change page if page is 2", () => {
			component.goToPage("...");
			expect(component.paginationConfig.page).toBe(1);
		});

		it("should call onChangePagination function when page is 2", () => {
			spyOn(component, "onChangePagination");
			component.goToPage(2);
			expect(component.onChangePagination).toHaveBeenCalledTimes(1);
		});
	});

	describe("getPageInputMaxDigits", () => {
		it("should return 3 when total of pages number is composed of 3 digits", () => {
			component.paginationConfig = {
				itemsPerPage: 4,
				page: 1,
				totalItems: 680
			};

			const getPageInputMaxDigits: number = component.getPageInputMaxDigits();
			expect(getPageInputMaxDigits).toBe(3);
		});

		it("should return 1 when total of pages number is composed of 1 digit", () => {
			component.paginationConfig = {
				itemsPerPage: 4,
				page: 1,
				totalItems: 20
			};

			const getPageInputMaxDigits: number = component.getPageInputMaxDigits();
			expect(getPageInputMaxDigits).toBe(1);
		});
	});

	describe("normalizePaginationConfig", () => {
		it("should set paginationConfig.totalItems to zero if paginationConfig is not defined", () => {
			const normalizedConfig: StarkPaginationConfig = component.normalizePaginationConfig(<any>undefined);
			expect(normalizedConfig).toEqual({ totalItems: 0 });
		});

		it("should set paginationConfig with default values if paginationConfig object is empty", () => {
			const paginationConfigDefault: StarkPaginationConfig = {
				page: 1,
				itemsPerPage: 5,
				itemsPerPageOptions: [5, 10, 15],
				isExtended: false,
				totalItems: 0,
				itemsPerPageIsPresent: true,
				pageNavIsPresent: true,
				pageInputIsPresent: true
			};

			const normalizedConfig: StarkPaginationConfig = component.normalizePaginationConfig({});
			expect(normalizedConfig).toEqual(paginationConfigDefault);
		});

		it("should NOT change paginationConfig if all properties of paginationConfig are already set", () => {
			const fullPaginationConfig: StarkPaginationConfig = {
				...paginationConfig,
				itemsPerPageIsPresent: true,
				pageNavIsPresent: true,
				pageInputIsPresent: true
			};
			const normalizedConfig: StarkPaginationConfig = component.normalizePaginationConfig(fullPaginationConfig);
			expect(normalizedConfig).toEqual(fullPaginationConfig);
		});
	});

	describe("onChangeItemsPerPage", () => {
		beforeEach(() => {
			component.paginationConfig = { ...paginationConfig };
		});

		it("should change page to 1", () => {
			component.onChangeItemsPerPage((<number[]>component.paginationConfig.itemsPerPageOptions)[1]);
			expect(component.paginationConfig.page).toBe(1);
		});

		it("should change itemsPerPage to 8", () => {
			component.onChangeItemsPerPage((<number[]>component.paginationConfig.itemsPerPageOptions)[1]);
			expect(component.paginationConfig.itemsPerPage).toBe(8);
		});

		it("should call onChangePagination 1 time", () => {
			spyOn(component, "onChangePagination");
			component.onChangeItemsPerPage((<number[]>component.paginationConfig.itemsPerPageOptions)[1]);
			expect(component.onChangePagination).toHaveBeenCalledTimes(1);
		});

		it("should NOT call onChangePagination if current 'itemsPerPage' value is the same than the new one", () => {
			spyOn(component, "onChangePagination");
			component.onChangeItemsPerPage((<number[]>paginationConfig.itemsPerPageOptions)[0]);
			expect(component.paginationConfig.page).toBe(paginationConfig.page);
		});
	});

	describe("onChangePagination", () => {
		beforeEach(() => {
			component.paginationConfig = { ...paginationConfig };
		});

		it("should emit the StarkPaginateEvent 1 time", () => {
			const mockObserver: SpyObj<Observer<any>> = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);

			component.paginated.subscribe(mockObserver);
			component.onChangePagination();

			expect(mockObserver.next).toHaveBeenCalledTimes(1);
			const event: StarkPaginateEvent = mockObserver.next.calls.argsFor(0)[0];
			expect(event).toBeDefined();
			expect(event.itemsPerPage).toBe(<number>component.paginationConfig.itemsPerPage);
			expect(event.page).toBe(<number>component.paginationConfig.page);

			expect(mockObserver.error).not.toHaveBeenCalled();
			expect(mockObserver.complete).not.toHaveBeenCalled();
		});

		it("should call setPageNumbers function 1 time", () => {
			spyOn(component, "setPageNumbers");
			component.onChangePagination();
			expect(component.setPageNumbers).toHaveBeenCalledTimes(1);
		});
	});

	describe("page nav", () => {
		const selectorPageNavElement = ".stark-pagination ul";

		it("should be rendered if pageNavIsPresent is true or undefined", () => {
			hostComponent.paginationConfig = { ...paginationConfig, pageNavIsPresent: true };
			hostFixture.detectChanges();

			const pageNavElement: DebugElement = hostFixture.debugElement.query(By.css(selectorPageNavElement));
			expect(pageNavElement).toBeDefined();
			expect(pageNavElement).not.toBeNull();
		});

		it("should be rendered if pageNavIsPresent is undefined", () => {
			hostComponent.paginationConfig = { ...paginationConfig, pageNavIsPresent: undefined };
			hostFixture.detectChanges();

			const pageNavElement: DebugElement = hostFixture.debugElement.query(By.css(selectorPageNavElement));
			expect(pageNavElement).toBeDefined();
			expect(pageNavElement).not.toBeNull();
		});

		it("should NOT be rendered if pageNavIsPresent is false", () => {
			hostComponent.paginationConfig = { ...paginationConfig, pageNavIsPresent: false };
			hostFixture.detectChanges();

			const pageNavElement: DebugElement = hostFixture.debugElement.query(By.css(selectorPageNavElement));
			expect(pageNavElement).toBeNull();
		});
	});

	describe("page input", () => {
		const selectorPageSelector = ".stark-pagination div.pagination-enter-page";

		it("should be rendered if pageInputIsPresent is undefined", () => {
			hostComponent.paginationConfig = { ...paginationConfig, pageInputIsPresent: undefined };
			hostFixture.detectChanges();

			const pageSelector: DebugElement = hostFixture.debugElement.query(By.css(selectorPageSelector));

			const pageSelectorInput: DebugElement = pageSelector.query(By.css("input"));
			expect(pageSelectorInput.properties["id"]).toBe(currentPagePrefix + htmlSuffixId);
			expect(pageSelectorInput.attributes["ng-reflect-model"]).toBe("2");
			const pageSelectorTotalPages: DebugElement = pageSelector.query(By.css(totalPagesSelector));
			expect(pageSelectorTotalPages.nativeElement.innerHTML).toBe("2");
		});

		it("should be rendered if pageInputIsPresent is true", () => {
			hostComponent.paginationConfig = { ...paginationConfig, pageInputIsPresent: true };
			hostFixture.detectChanges();

			const pageSelector: DebugElement = hostFixture.debugElement.query(By.css(selectorPageSelector));

			const pageSelectorInput: DebugElement = pageSelector.query(By.css("input"));
			expect(pageSelectorInput.properties["id"]).toBe(currentPagePrefix + htmlSuffixId);
			expect(pageSelectorInput.attributes["ng-reflect-model"]).toBe("2");
			const pageSelectorTotalPages: DebugElement = pageSelector.query(By.css(totalPagesSelector));
			expect(pageSelectorTotalPages.nativeElement.innerHTML).toBe("2");
		});

		it("should NOT be rendered if pageInputIsPresent is false", () => {
			hostComponent.paginationConfig = { ...paginationConfig, pageInputIsPresent: false };
			hostFixture.detectChanges();

			const pageSelector: DebugElement = hostFixture.debugElement.query(By.css(selectorPageSelector));
			expect(pageSelector).toBeNull();
		});

		it("should trigger the pagination when a valid page is typed and the Enter key is pressed", fakeAsync(() => {
			hostComponent.paginationConfig = { ...paginationConfig, pageInputIsPresent: true };
			hostFixture.detectChanges();

			assertPageNavSelection(hostFixture.debugElement.childNodes[0], "2");

			changeInputValueAndPressEnter(hostFixture.debugElement.childNodes[0], "1");

			hostFixture.detectChanges();
			tick(); // since values are set on ngModel asynchronously (see https://github.com/angular/angular/issues/22606)

			assertPageInputSelection(hostFixture.debugElement.childNodes[0], "1");
			assertPageNavSelection(hostFixture.debugElement.childNodes[0], "1");
		}));

		it("should NOT trigger the pagination when an invalid page is typed and the Enter key is pressed", fakeAsync(() => {
			hostComponent.paginationConfig = { ...paginationConfig, pageInputIsPresent: true };
			hostFixture.detectChanges();

			assertPageNavSelection(hostFixture.debugElement.childNodes[0], "2");

			changeInputValueAndPressEnter(hostFixture.debugElement.childNodes[0], "4");
			hostFixture.detectChanges();
			tick(); // since values are set on ngModel asynchronously (see https://github.com/angular/angular/issues/22606)

			assertPageInputSelection(hostFixture.debugElement.childNodes[0], "2"); // the input value is reverted to the last valid value
			assertPageNavSelection(hostFixture.debugElement.childNodes[0], "2");
		}));
	});

	describe("itemsPerPage dropdown", () => {
		it("should be rendered if itemsPerPageIsPresent is undefined", () => {
			hostComponent.paginationConfig = { ...paginationConfig, itemsPerPageIsPresent: undefined };
			hostFixture.detectChanges();

			const itemsPerPageSelector: DebugElement = hostFixture.debugElement.query(By.directive(StarkDropdownComponent));
			expect(itemsPerPageSelector).not.toBeNull();
			expect(itemsPerPageSelector).toBeDefined();
			expect(itemsPerPageSelector.attributes["ng-reflect-dropdown-id"]).toBe(itemsPerPagePrefix + htmlSuffixId);
			/// expect(itemsPerPageSelector.attr("header")).toBe("STARK.PAGINATION.ITEMS_PER_PAGE"); // TODO add a header to the itemsPerPage dropdown
		});

		it("should be rendered if itemsPerPageIsPresent is true", () => {
			hostComponent.paginationConfig = { ...paginationConfig, itemsPerPageIsPresent: true };
			hostFixture.detectChanges();

			const itemsPerPageSelector: DebugElement = hostFixture.debugElement.query(By.directive(StarkDropdownComponent));
			expect(itemsPerPageSelector).not.toBeNull();
			expect(itemsPerPageSelector).toBeDefined();
			expect(itemsPerPageSelector.attributes["ng-reflect-dropdown-id"]).toBe(itemsPerPagePrefix + htmlSuffixId);
			/// expect(itemsPerPageSelector.attr("header")).toBe("STARK.PAGINATION.ITEMS_PER_PAGE"); // TODO add a header to the itemsPerPage dropdown
		});

		it("should NOT be rendered if pageInputIsPresent is false", () => {
			hostComponent.paginationConfig = { ...paginationConfig, itemsPerPageIsPresent: false };
			hostFixture.detectChanges();

			const itemsPerPageSelector: DebugElement = hostFixture.debugElement.query(By.directive(StarkDropdownComponent));
			expect(itemsPerPageSelector).toBeNull();
		});
	});

	describe("navigation buttons", () => {
		describe("goToFirst", () => {
			let firstButtonElement: DebugElement | null;
			const selectorFirstButtonElement = "li.first-page button";

			it("button should not be rendered in extended mode", () => {
				hostComponent.paginationConfig = { ...paginationConfig, page: 2, isExtended: true };
				hostFixture.detectChanges();

				firstButtonElement = hostFixture.debugElement.query(By.css(selectorFirstButtonElement));
				expect(firstButtonElement).toBeNull();
			});

			it("should change the page when the page is not already the first one", fakeAsync(() => {
				hostComponent.paginationConfig = { ...paginationConfig, page: 2, isExtended: false };
				hostFixture.detectChanges();
				tick(); // since values are set on ngModel asynchronously (see https://github.com/angular/angular/issues/22606)

				assertPageNavSelection(hostFixture.debugElement.childNodes[0], "2");
				assertPageInputSelection(hostFixture.debugElement.childNodes[0], "2");

				firstButtonElement = hostFixture.debugElement.query(By.css(selectorFirstButtonElement));
				expect(firstButtonElement.attributes["disabled"]).toBeFalsy();
				triggerClick(firstButtonElement);
				hostFixture.detectChanges();
				tick(); // since values are set on ngModel asynchronously (see https://github.com/angular/angular/issues/22606)

				firstButtonElement = hostFixture.debugElement.query(By.css(selectorFirstButtonElement));
				expect(firstButtonElement.attributes["disabled"]).toBeTruthy();
				assertPageNavSelection(hostFixture.debugElement.childNodes[0], "1");
				assertPageInputSelection(hostFixture.debugElement.childNodes[0], "1");
			}));

			it("should not change the page if the page is already the first one", fakeAsync(() => {
				hostComponent.paginationConfig = { ...paginationConfig, page: 1, isExtended: false };
				hostFixture.detectChanges();
				tick(); // since values are set on ngModel asynchronously (see https://github.com/angular/angular/issues/22606)

				assertPageNavSelection(hostFixture.debugElement.childNodes[0], "1");
				assertPageInputSelection(hostFixture.debugElement.childNodes[0], "1");

				firstButtonElement = hostFixture.debugElement.query(By.css(selectorFirstButtonElement));
				expect(firstButtonElement.attributes["disabled"]).toBeTruthy();
				triggerClick(firstButtonElement);
				hostFixture.detectChanges();
				tick(); // since values are set on ngModel asynchronously (see https://github.com/angular/angular/issues/22606)

				firstButtonElement = hostFixture.debugElement.query(By.css(selectorFirstButtonElement));
				expect(firstButtonElement.attributes["disabled"]).toBeTruthy();
				assertPageNavSelection(hostFixture.debugElement.childNodes[0], "1");
				assertPageInputSelection(hostFixture.debugElement.childNodes[0], "1");
			}));
		});

		describe("goToPrevious", () => {
			let previousButtonElement: DebugElement;
			const selectorPreviousButtonElement = "li.previous button";

			it("should change the page when the page is not already the first one", fakeAsync(() => {
				hostComponent.paginationConfig = { ...paginationConfig, page: 2 };
				hostFixture.detectChanges();
				tick(); // since values are set on ngModel asynchronously (see https://github.com/angular/angular/issues/22606)

				assertPageNavSelection(hostFixture.debugElement.childNodes[0], "2");
				assertPageInputSelection(hostFixture.debugElement.childNodes[0], "2");

				previousButtonElement = hostFixture.debugElement.query(By.css(selectorPreviousButtonElement));
				expect(previousButtonElement.attributes["disabled"]).toBeFalsy();
				triggerClick(previousButtonElement);
				hostFixture.detectChanges();
				tick(); // since values are set on ngModel asynchronously (see https://github.com/angular/angular/issues/22606)

				previousButtonElement = hostFixture.debugElement.query(By.css(selectorPreviousButtonElement));
				expect(previousButtonElement.attributes["disabled"]).toBeTruthy();
				assertPageNavSelection(hostFixture.debugElement.childNodes[0], "1");
				assertPageInputSelection(hostFixture.debugElement.childNodes[0], "1");
			}));

			it("should not change the page if the page is already the first one", fakeAsync(() => {
				hostComponent.paginationConfig = { ...paginationConfig, page: 1 };
				hostFixture.detectChanges();
				tick(); // since values are set on ngModel asynchronously (see https://github.com/angular/angular/issues/22606)

				assertPageNavSelection(hostFixture.debugElement.childNodes[0], "1");
				assertPageInputSelection(hostFixture.debugElement.childNodes[0], "1");

				previousButtonElement = hostFixture.debugElement.query(By.css(selectorPreviousButtonElement));
				expect(previousButtonElement.attributes["disabled"]).toBeTruthy();
				triggerClick(previousButtonElement);
				hostFixture.detectChanges();
				tick(); // since values are set on ngModel asynchronously (see https://github.com/angular/angular/issues/22606)

				previousButtonElement = hostFixture.debugElement.query(By.css(selectorPreviousButtonElement));
				expect(previousButtonElement.attributes["disabled"]).toBeTruthy();
				assertPageNavSelection(hostFixture.debugElement.childNodes[0], "1");
				assertPageInputSelection(hostFixture.debugElement.childNodes[0], "1");
			}));
		});

		describe("goToNext", () => {
			let nextButtonElement: DebugElement;
			const selectorNextButtonElement = "li.next button";

			it("should change the page if the page is not already the last one", fakeAsync(() => {
				hostComponent.paginationConfig = { ...paginationConfig, page: 1 };
				hostFixture.detectChanges();
				tick(); // since values are set on ngModel asynchronously (see https://github.com/angular/angular/issues/22606)

				assertPageNavSelection(hostFixture.debugElement.childNodes[0], "1");
				assertPageInputSelection(hostFixture.debugElement.childNodes[0], "1");

				nextButtonElement = hostFixture.debugElement.query(By.css(selectorNextButtonElement));
				expect(nextButtonElement.attributes["disabled"]).toBeFalsy();
				triggerClick(nextButtonElement);
				hostFixture.detectChanges();
				tick(); // since values are set on ngModel asynchronously (see https://github.com/angular/angular/issues/22606)

				nextButtonElement = hostFixture.debugElement.query(By.css(selectorNextButtonElement));
				expect(nextButtonElement.attributes["disabled"]).toBeTruthy();
				assertPageNavSelection(hostFixture.debugElement.childNodes[0], "2");
				assertPageInputSelection(hostFixture.debugElement.childNodes[0], "2");
			}));

			it("should not change the page if the page is already the last one", fakeAsync(() => {
				hostComponent.paginationConfig = { ...paginationConfig, page: 2 };
				hostFixture.detectChanges();
				tick(); // since values are set on ngModel asynchronously (see https://github.com/angular/angular/issues/22606)

				assertPageNavSelection(hostFixture.debugElement.childNodes[0], "2");
				assertPageInputSelection(hostFixture.debugElement.childNodes[0], "2");

				nextButtonElement = hostFixture.debugElement.query(By.css(selectorNextButtonElement));
				expect(nextButtonElement.attributes["disabled"]).toBeTruthy();
				triggerClick(nextButtonElement);
				hostFixture.detectChanges();
				tick(); // since values are set on ngModel asynchronously (see https://github.com/angular/angular/issues/22606)

				nextButtonElement = hostFixture.debugElement.query(By.css(selectorNextButtonElement));
				expect(nextButtonElement.attributes["disabled"]).toBeTruthy();
				assertPageNavSelection(hostFixture.debugElement.childNodes[0], "2");
				assertPageInputSelection(hostFixture.debugElement.childNodes[0], "2");
			}));
		});

		describe("goToLast", () => {
			let lastButtonElement: DebugElement | null;
			const selectorLastButtonElement = "li.last-page button";

			it("button should not be rendered in extended mode", () => {
				hostComponent.paginationConfig = { ...paginationConfig, page: 2, isExtended: true };
				hostFixture.detectChanges();

				lastButtonElement = hostFixture.debugElement.query(By.css("li.first-page button"));
				expect(lastButtonElement).toBeNull();
			});

			it("should change the page if the page is not already the last one", fakeAsync(() => {
				hostComponent.paginationConfig = { ...paginationConfig, page: 1, isExtended: false };
				hostFixture.detectChanges();
				tick(); // since values are set on ngModel asynchronously (see https://github.com/angular/angular/issues/22606)

				assertPageNavSelection(hostFixture.debugElement.childNodes[0], "1");
				assertPageInputSelection(hostFixture.debugElement.childNodes[0], "1");

				lastButtonElement = hostFixture.debugElement.query(By.css(selectorLastButtonElement));
				expect(lastButtonElement.attributes["disabled"]).toBeFalsy();
				triggerClick(lastButtonElement);
				hostFixture.detectChanges();
				tick(); // since values are set on ngModel asynchronously (see https://github.com/angular/angular/issues/22606)

				lastButtonElement = hostFixture.debugElement.query(By.css(selectorLastButtonElement));
				expect(lastButtonElement.attributes["disabled"]).toBeTruthy();
				assertPageNavSelection(hostFixture.debugElement.childNodes[0], "2");
				assertPageInputSelection(hostFixture.debugElement.childNodes[0], "2");
			}));

			it("should not change the page if the page is already the last one", fakeAsync(() => {
				hostComponent.paginationConfig = { ...paginationConfig, page: 2, isExtended: false };
				hostFixture.detectChanges();
				tick(); // since values are set on ngModel asynchronously (see https://github.com/angular/angular/issues/22606)

				assertPageNavSelection(hostFixture.debugElement.childNodes[0], "2");
				assertPageInputSelection(hostFixture.debugElement.childNodes[0], "2");

				lastButtonElement = hostFixture.debugElement.query(By.css(selectorLastButtonElement));
				expect(lastButtonElement.attributes["disabled"]).toBeTruthy();
				triggerClick(lastButtonElement);
				hostFixture.detectChanges();
				tick(); // since values are set on ngModel asynchronously (see https://github.com/angular/angular/issues/22606)

				lastButtonElement = hostFixture.debugElement.query(By.css(selectorLastButtonElement));
				expect(lastButtonElement.attributes["disabled"]).toBeTruthy();
				assertPageNavSelection(hostFixture.debugElement.childNodes[0], "2");
				assertPageInputSelection(hostFixture.debugElement.childNodes[0], "2");
			}));
		});
	});

	describe("pageNumbers", () => {
		it("should change page if click on page number", fakeAsync(() => {
			hostComponent.paginationConfig = { ...paginationConfig, page: 2, totalItems: 10 };
			hostFixture.detectChanges();
			tick(); // since values are set on ngModel asynchronously (see https://github.com/angular/angular/issues/22606)

			assertPageNavSelection(hostFixture.debugElement.childNodes[0], "2");
			assertPageInputSelection(hostFixture.debugElement.childNodes[0], "2");

			const pageTwoElement: DebugElement | undefined = hostFixture.debugElement
				.queryAll(By.css("li a"))
				.find((el: DebugElement) => el.nativeElement.textContent === "3");
			if (!pageTwoElement) {
				fail("li a with innerHTML '3' not found.");
				return;
			}
			triggerClick(pageTwoElement);
			hostFixture.detectChanges();
			tick(); // since values are set on ngModel asynchronously (see https://github.com/angular/angular/issues/22606)

			assertPageNavSelection(hostFixture.debugElement.childNodes[0], "3");
			assertPageInputSelection(hostFixture.debugElement.childNodes[0], "3");
		}));

		it("should not change page if click on '...'", fakeAsync(() => {
			hostComponent.paginationConfig = { ...paginationConfig, page: 1, totalItems: 50 };
			hostFixture.detectChanges();
			tick(); // since values are set on ngModel asynchronously (see https://github.com/angular/angular/issues/22606)

			assertPageNavSelection(hostFixture.debugElement.childNodes[0], "1");
			assertPageInputSelection(hostFixture.debugElement.childNodes[0], "1");

			const morePagesElement: DebugElement | undefined = hostFixture.debugElement
				.queryAll(By.css("li"))
				.find((el: DebugElement) => el.nativeElement.textContent === "...");
			if (!morePagesElement) {
				fail("No li element with textContent '...' found.");
				return;
			}
			triggerClick(morePagesElement);
			hostFixture.detectChanges();
			tick(); // since values are set on ngModel asynchronously (see https://github.com/angular/angular/issues/22606)

			assertPageNavSelection(hostFixture.debugElement.childNodes[0], "1");
			assertPageInputSelection(hostFixture.debugElement.childNodes[0], "1");
		}));
	});

	describe("on paginationConfig change", () => {
		beforeEach(fakeAsync(() => {
			hostComponent.paginationConfig = { ...paginationConfig, totalItems: 10 };
			hostFixture.detectChanges();
			tick(); // since values are set on ngModel asynchronously (see https://github.com/angular/angular/issues/22606)
		}));

		it("should change pageNumbers if totalItems has changed", () => {
			const previousPageNumbersLength: number = hostFixture.debugElement.queryAll(By.css(pageNumbersSelector)).length;
			hostComponent.paginationConfig = { ...paginationConfig, totalItems: 13 };
			hostFixture.detectChanges();
			const currentPageNumbersElement: number = hostFixture.debugElement.queryAll(By.css(pageNumbersSelector)).length;
			expect(currentPageNumbersElement).not.toEqual(previousPageNumbersLength);
		});

		it("should not change pageNumbers if totalItems has not changed", () => {
			const previousPageNumbersLength: number = hostFixture.debugElement.queryAll(By.css(pageNumbersSelector)).length;
			hostComponent.paginationConfig = { ...paginationConfig, totalItems: 10 };
			hostFixture.detectChanges();
			const currentPageNumbersElement: number = hostFixture.debugElement.queryAll(By.css(pageNumbersSelector)).length;
			expect(currentPageNumbersElement).toEqual(previousPageNumbersLength);
		});

		it("should set current page to 1 when it is undefined in config", fakeAsync(() => {
			assertPageNavSelection(hostFixture.debugElement.childNodes[0], "2");
			assertPageInputSelection(hostFixture.debugElement.childNodes[0], "2");

			hostComponent.paginationConfig = { ...paginationConfig, page: undefined };
			hostFixture.detectChanges();
			tick(); // since values are set on ngModel asynchronously (see https://github.com/angular/angular/issues/22606)

			assertPageNavSelection(hostFixture.debugElement.childNodes[0], "1");
			assertPageInputSelection(hostFixture.debugElement.childNodes[0], "1");
		}));
	});
});
