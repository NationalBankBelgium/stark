/* tslint:disable:completed-docs no-identical-functions */
import { Observable, Observer, of, Subject, Subscriber, throwError } from "rxjs";
import { AbstractStarkSearchComponent, StarkGenericSearchService } from "../classes";
import { MockStarkLoggingService } from "@nationalbankbelgium/stark-core/testing";
import { StarkResource } from "@nationalbankbelgium/stark-core";
import { FormGroup } from "@angular/forms";
import { StarkSearchState } from "../entities";
import { MockStarkProgressIndicatorService } from "../../progress-indicator/testing";
import Spy = jasmine.Spy;
import SpyObj = jasmine.SpyObj;
import createSpy = jasmine.createSpy;
import createSpyObj = jasmine.createSpyObj;

/* tslint:disable:no-big-function */
describe("AbstractSearchComponent", () => {
	let component: SearchComponentHelper;
	let genericSearchService: SpyObj<StarkGenericSearchService<MockResource, SearchCriteria>>;
	let mockLogger: MockStarkLoggingService;

	let mockProgressService: MockStarkProgressIndicatorService;

	let originalSearchCriteria: SearchCriteria;
	let getSearchStateObsTeardown: Spy;
	let searchObsTeardown: Spy;
	let mockObserver: SpyObj<Observer<any>>;

	beforeEach(() => {
		genericSearchService = createSpyObj("genericSearchService", ["getSearchState", "resetSearchState", "createNew", "search"]);
		mockLogger = new MockStarkLoggingService();

		mockProgressService = new MockStarkProgressIndicatorService();

		component = new SearchComponentHelper(genericSearchService, mockLogger, mockProgressService);
		getSearchStateObsTeardown = createSpy("getSearchStateObsTeardown");
		searchObsTeardown = createSpy("searchObsTeardown");
		originalSearchCriteria = { uuid: "3" };
		genericSearchService.getSearchState.and.returnValue(
			createObservableOf<StarkSearchState<SearchCriteria>>(
				{
					criteria: originalSearchCriteria,
					hasBeenSearched: false
				},
				getSearchStateObsTeardown
			)
		);

		mockObserver = createSpyObj<Observer<any>>("observerSpy", ["next", "error", "complete"]);
	});
	describe("ngOnInit", () => {
		it("should clone the searchCriteria as originalCopy and search again if hasBeenSearched is TRUE", () => {
			const expectedResult: MockResource[] = [{ uuid: "1", name: "first" }, { uuid: "2", name: "second" }];

			genericSearchService.search.and.returnValue(of(expectedResult));
			genericSearchService.getSearchState.and.returnValue(
				of({
					criteria: originalSearchCriteria,
					hasBeenSearched: true
				})
			);

			component.ngOnInit();

			component.getResults().subscribe(mockObserver);
			expect(mockObserver.next).toHaveBeenCalledTimes(1);
			expect(mockObserver.next).toHaveBeenCalledWith(expectedResult);
			expect(mockObserver.error).not.toHaveBeenCalled();
			expect(mockObserver.complete).not.toHaveBeenCalled();

			expect(genericSearchService.search).toHaveBeenCalledTimes(1);
			expect(component.getOriginalCopy()).toBe(originalSearchCriteria);
			expect(component.getWorkingCopy()).toEqual(originalSearchCriteria);
			expect(component.getOriginalCopy()).not.toBe(component.getWorkingCopy());
		});

		it("should set the searchCriteria as original copy and DON'T search if hasBeenSearched is FALSE", () => {
			genericSearchService.getSearchState.and.returnValue(
				of({
					criteria: originalSearchCriteria,
					hasBeenSearched: false
				})
			);

			component.ngOnInit();

			component.getResults().subscribe(mockObserver);
			expect(mockObserver.next).toHaveBeenCalledTimes(1);
			expect(mockObserver.next).toHaveBeenCalledWith([]);
			expect(mockObserver.error).not.toHaveBeenCalled();
			expect(mockObserver.complete).not.toHaveBeenCalled();

			expect(genericSearchService.search).not.toHaveBeenCalled();
			expect(component.getOriginalCopy()).toBe(originalSearchCriteria);
			expect(component.getWorkingCopy()).toEqual(originalSearchCriteria);
			expect(component.getOriginalCopy()).not.toBe(component.getWorkingCopy());
		});

		it("should subscribe for changes of the search state and set it as original copy whenever a change is triggered", () => {
			const searchState$: Subject<StarkSearchState<SearchCriteria>> = new Subject();
			const mockCriteria1: SearchCriteria = { uuid: "dummy uuid" };
			const mockCriteria2: SearchCriteria = { uuid: "another uuid" };

			genericSearchService.search.and.returnValue(of(<any>"dummy search result"));
			genericSearchService.getSearchState.and.returnValue(searchState$.asObservable());

			component.ngOnInit();

			searchState$.next({
				criteria: mockCriteria1,
				hasBeenSearched: true
			});

			expect(component.getOriginalCopy()).not.toEqual(originalSearchCriteria);
			expect(component.getOriginalCopy()).toBe(mockCriteria1);
			expect(component.getWorkingCopy()).toEqual(mockCriteria1);
			expect(component.getOriginalCopy()).not.toBe(component.getWorkingCopy());

			mockObserver.next.calls.reset();
			searchState$.next({
				criteria: mockCriteria2,
				hasBeenSearched: true
			});

			expect(component.getOriginalCopy()).not.toEqual(originalSearchCriteria);
			expect(component.getOriginalCopy()).not.toEqual(mockCriteria1);
			expect(component.getOriginalCopy()).toBe(mockCriteria2);
			expect(component.getWorkingCopy()).toEqual(mockCriteria2);
			expect(component.getOriginalCopy()).not.toBe(component.getWorkingCopy());

			searchState$.complete();
		});
	});

	describe("ngOnDestroy", () => {
		it("should cancel the subscription of the searchState", () => {
			genericSearchService.getSearchState.and.returnValue(
				createObservableOf<StarkSearchState<SearchCriteria>>(
					{
						criteria: originalSearchCriteria,
						hasBeenSearched: false
					},
					getSearchStateObsTeardown
				)
			);

			component.ngOnInit();
			component.ngOnDestroy();

			expect(getSearchStateObsTeardown).toHaveBeenCalledTimes(1);
		});
	});

	describe("onSearch", () => {
		it("should call performSearch() passing the working copy if the form is valid", () => {
			const formMock: FormGroup = <any>{
				controls: {},
				invalid: false
			};

			spyOn(component, "performSearch");
			component.ngOnInit();
			component.onSearch(formMock);

			expect(component.performSearch).toHaveBeenCalledTimes(1);
			expect(component.performSearch).toHaveBeenCalledWith(component.getWorkingCopy());
		});

		it("should NOT call performSearch() if the form NOT valid", () => {
			const formMock: FormGroup = <any>{
				controls: {},
				invalid: true
			};

			spyOn(component, "performSearch");
			component.ngOnInit();
			component.onSearch(formMock);

			expect(component.performSearch).not.toHaveBeenCalled();
		});
	});

	describe("onNew", () => {
		it("should call the genericSearchService.createNew()", () => {
			component.ngOnInit();
			component.onNew();

			expect(genericSearchService.createNew).toHaveBeenCalledTimes(1);
		});
	});

	describe("onReset", () => {
		it("should call the genericSearchService.resetSearchState() and clear the results$", () => {
			const formMock: FormGroup = new FormGroup({});
			component.ngOnInit();
			component.onReset(formMock);

			component.getResults().subscribe(mockObserver);

			expect(mockObserver.next).toHaveBeenCalledTimes(1);
			expect(mockObserver.next).toHaveBeenCalledWith([]);
			expect(mockObserver.error).not.toHaveBeenCalled();
			expect(mockObserver.complete).not.toHaveBeenCalled();

			expect(genericSearchService.resetSearchState).toHaveBeenCalledTimes(1);
		});
	});

	describe("performSearch", () => {
		it("should call genericSearchService.search() passing the working copy if no searchCriteria defined", () => {
			const expectedResult: MockResource[] = [{ uuid: "1", name: "first" }, { uuid: "2", name: "second" }];
			genericSearchService.search.and.returnValue(createObservableOf<MockResource[]>(expectedResult, searchObsTeardown));

			component.ngOnInit();
			component.performSearch();

			component.getResults().subscribe(mockObserver);
			expect(mockObserver.next).toHaveBeenCalledTimes(1);
			expect(mockObserver.next).toHaveBeenCalledWith(expectedResult);
			expect(mockObserver.error).not.toHaveBeenCalled();
			expect(mockObserver.complete).not.toHaveBeenCalled();

			expect(searchObsTeardown).toHaveBeenCalledTimes(1);
			expect(genericSearchService.search).toHaveBeenCalledTimes(1);
			expect(genericSearchService.search).toHaveBeenCalledWith(component.getWorkingCopy());
		});

		it("should call genericSearchService.search() passing the given searchCriteria", () => {
			const expectedResult: MockResource[] = [{ uuid: "1", name: "first" }, { uuid: "2", name: "second" }];
			const customCriteria: SearchCriteria = { uuid: "11" };
			genericSearchService.search.and.returnValue(createObservableOf<MockResource[]>(expectedResult, searchObsTeardown));

			component.ngOnInit();
			component.performSearch(customCriteria);

			component.getResults().subscribe(mockObserver);
			expect(mockObserver.next).toHaveBeenCalledTimes(1);
			expect(mockObserver.next).toHaveBeenCalledWith(expectedResult);
			expect(mockObserver.error).not.toHaveBeenCalled();
			expect(mockObserver.complete).not.toHaveBeenCalled();

			expect(searchObsTeardown).toHaveBeenCalledTimes(1);
			expect(genericSearchService.search).toHaveBeenCalledTimes(1);
			expect(genericSearchService.search).toHaveBeenCalledWith(customCriteria);
		});

		it("should call genericSearchService.search() ONLY ONCE if no previous search has been made regardless of searchState changes", () => {
			const searchState$: Subject<StarkSearchState<SearchCriteria>> = new Subject();
			const pristineCriteria: SearchCriteria = { uuid: "" };

			const expectedResult: MockResource[] = [{ uuid: "1", name: "first" }, { uuid: "2", name: "second" }];
			const customCriteria: SearchCriteria = { uuid: "11" };
			genericSearchService.search.and.returnValue(createObservableOf<MockResource[]>(expectedResult, searchObsTeardown));
			genericSearchService.getSearchState.and.returnValue(searchState$);

			component.ngOnInit();

			// initial search state => hasBeenSearched = false
			searchState$.next({
				criteria: pristineCriteria,
				hasBeenSearched: false
			});

			component.getResults().subscribe(mockObserver);
			expect(mockObserver.next).toHaveBeenCalledTimes(1);
			expect(mockObserver.next).toHaveBeenCalledWith([]); // initial value
			expect(mockObserver.error).not.toHaveBeenCalled();
			expect(mockObserver.complete).not.toHaveBeenCalled();

			expect(genericSearchService.search).not.toHaveBeenCalled();
			mockObserver.next.calls.reset();

			// perform first manual search
			component.performSearch(customCriteria);

			expect(mockObserver.next).toHaveBeenCalledTimes(1);
			expect(mockObserver.next).toHaveBeenCalledWith(expectedResult);
			expect(mockObserver.error).not.toHaveBeenCalled();
			expect(mockObserver.complete).not.toHaveBeenCalled();

			expect(searchObsTeardown).toHaveBeenCalledTimes(1);
			expect(genericSearchService.search).toHaveBeenCalledTimes(1);
			expect(genericSearchService.search).toHaveBeenCalledWith(customCriteria);

			genericSearchService.search.calls.reset();

			// simulating searchState change due to first manual search => hasBeenSearched = true
			searchState$.next({
				criteria: customCriteria,
				hasBeenSearched: true
			});

			expect(genericSearchService.search).not.toHaveBeenCalled();
		});

		it("should call progressService show/hide methods passing the progressTopic defined before and after performing the search", () => {
			const expectedResult: MockResource[] = [{ uuid: "1", name: "first" }, { uuid: "2", name: "second" }];
			genericSearchService.search.and.returnValue(of(expectedResult));

			const dummyTopic = "dummyTopic";
			component.setProgressTopic(dummyTopic);

			component.ngOnInit();
			component.performSearch();

			component.getResults().subscribe(mockObserver);
			expect(mockObserver.next).toHaveBeenCalledTimes(1);
			expect(mockObserver.next).toHaveBeenCalledWith(expectedResult);
			expect(mockObserver.error).not.toHaveBeenCalled();
			expect(mockObserver.complete).not.toHaveBeenCalled();

			expect(mockProgressService.show).toHaveBeenCalledTimes(1);
			expect(mockProgressService.show).toHaveBeenCalledWith(dummyTopic);
			expect(mockProgressService.hide).toHaveBeenCalledTimes(1);
			expect(mockProgressService.hide).toHaveBeenCalledWith(dummyTopic);
		});

		it("should call progressService show/hide methods passing the progressTopic defined before and after performing a failing search", () => {
			genericSearchService.search.and.returnValue(throwError("search failed"));

			const dummyTopic = "dummyTopic";
			component.setProgressTopic(dummyTopic);

			component.ngOnInit();
			component.performSearch();

			component.getResults().subscribe();

			expect(mockProgressService.show).toHaveBeenCalledTimes(1);
			expect(mockProgressService.show).toHaveBeenCalledWith(dummyTopic);
			expect(mockProgressService.hide).toHaveBeenCalledTimes(1);
			expect(mockProgressService.hide).toHaveBeenCalledWith(dummyTopic);
		});

		it("should NOT call progressService show/hide methods before and after performing the search in case no progressTopic is defined", () => {
			const expectedResult: MockResource[] = [{ uuid: "1", name: "first" }, { uuid: "2", name: "second" }];
			genericSearchService.search.and.returnValue(of(expectedResult));

			component.setProgressTopic("");
			component.ngOnInit();
			component.performSearch();

			component.getResults().subscribe(mockObserver);
			expect(mockObserver.next).toHaveBeenCalledTimes(1);
			expect(mockObserver.next).toHaveBeenCalledWith(expectedResult);
			expect(mockObserver.error).not.toHaveBeenCalled();
			expect(mockObserver.complete).not.toHaveBeenCalled();

			expect(mockProgressService.show).not.toHaveBeenCalled();
			expect(mockProgressService.hide).not.toHaveBeenCalled();
		});
	});

	describe("latestResults", () => {
		it("should return an empty array when no search has been performed yet as long as the preserveLatestResults option is enabled", () => {
			component.enablePreserveLatestResults(true);
			component.ngOnInit();

			expect(component.latestResults).toEqual([]);
		});

		it("should return the results from the latest search that was performed as long as the preserveLatestResults option is enabled", () => {
			const expectedResult: MockResource[] = [{ uuid: "1", name: "first" }, { uuid: "2", name: "second" }];
			genericSearchService.search.and.returnValue(of(expectedResult));

			component.enablePreserveLatestResults(true);
			component.ngOnInit();
			component.performSearch();

			expect(component.latestResults).toBe(expectedResult);
		});

		it("should return undefined regardless of any search that was performed when the preserveLatestResults option is disabled", () => {
			const expectedResult: MockResource[] = [{ uuid: "1", name: "first" }, { uuid: "2", name: "second" }];
			genericSearchService.search.and.returnValue(of(expectedResult));

			component.enablePreserveLatestResults(false);
			component.ngOnInit();
			component.performSearch();

			expect(component.latestResults).toBe(<any>undefined);
		});
	});
});

interface MockResource extends StarkResource {
	name?: string;
}

interface SearchCriteria {
	uuid: string;
}

function createObservableOf<T>(value: T, teardown: Function): Observable<T> {
	return new Observable(
		(subscriber: Subscriber<T>): Function => {
			subscriber.next(value);
			return teardown;
		}
	);
}

class SearchComponentHelper extends AbstractStarkSearchComponent<MockResource, SearchCriteria> {
	public constructor(
		_genericSearchService_: StarkGenericSearchService<MockResource, SearchCriteria>,
		logger: MockStarkLoggingService,
		progressService: MockStarkProgressIndicatorService
	) {
		super(_genericSearchService_, logger, progressService);
	}

	public enablePreserveLatestResults(value: boolean): void {
		this.preserveLatestResults = value;
	}

	public getWorkingCopy(): MockResource {
		return this.workingCopy;
	}

	public getOriginalCopy(): MockResource {
		return this.originalCopy;
	}

	public setWorkingCopy(workingCopy: MockResource): void {
		this.workingCopy = workingCopy;
	}

	public updateOriginalCopy(originalCopy: MockResource): void {
		this.originalCopy = originalCopy;
	}

	public getResults(): Observable<MockResource[]> {
		return this.results$;
	}

	public getProgressTopic(): string {
		return this.progressIndicatorConfig.topic;
	}

	public setProgressTopic(topic: string): void {
		this.progressIndicatorConfig.topic = topic;
	}
}
