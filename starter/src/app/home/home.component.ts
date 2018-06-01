import { Component, Inject, OnInit } from "@angular/core";
import {
	STARK_HTTP_SERVICE,
	STARK_LOGGING_SERVICE,
	StarkBackend,
	StarkBackendAuthenticationTypes,
	StarkCollectionResponseWrapper,
	StarkErrorImpl,
	StarkHttpErrorWrapper,
	StarkHttpRequestType,
	StarkHttpSerializer,
	StarkHttpSerializerImpl,
	StarkHttpService,
	StarkLoggingService,
	StarkQueryParam,
	StarkSingleItemResponseWrapper
} from "@nationalbankbelgium/stark-core";
import { Observable } from "rxjs";

import { AppState } from "../app.service";
import { Request } from "./request.entity";

@Component({
	/**
	 * The selector is what angular internally uses
	 * for `document.querySelectorAll(selector)` in our index.html
	 * where, in this case, selector is the string 'home'.
	 */
	selector: "home", // <home></home>
	/**
	 * We need to tell Angular's Dependency Injection which providers are in our app.
	 */
	providers: [],
	/**
	 * Our list of styles in our component. We may add more to compose many styles together.
	 */
	styleUrls: ["./home.component.pcss"],
	/**
	 * Every Angular template is first compiled by the browser before Angular runs it's compiler.
	 */
	templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
	/**
	 * Set our default values
	 */
	public localState: any = { value: " " };

	/**
	 * TypeScript public modifiers
	 */
	public constructor(
		public appState: AppState,
		@Inject(STARK_HTTP_SERVICE) public httpService: StarkHttpService<any>,
		@Inject(STARK_LOGGING_SERVICE) public loggingService: StarkLoggingService
	) {}

	public ngOnInit(): void {
		this.loggingService.debug("hello from `Home` component");
	}

	public submitState(value: string): void {
		this.loggingService.debug("submitState", value);
		this.appState.set("value", value);
		this.localState.value = "";
	}

	public logError(): void {
		try {
			throw new Error("Invoked error");
		} catch (error) {
			this.loggingService.error("Logging the Error", error);
		}
	}

	public logStarkError(): void {
		try {
			throw new Error("Invoked error");
		} catch (error) {
			this.loggingService.error("Logging the StarkError", new StarkErrorImpl(error));
		}
	}

	public triggerHttpCall(type: "collection" | "singleItem" | "singleNonExistingItem"): void {
		const serializer: StarkHttpSerializer<Request> = new StarkHttpSerializerImpl<any>(Request);
		const backend: StarkBackend = {
			name: "someBackend",
			url: "http://localhost:5000",
			authenticationType: StarkBackendAuthenticationTypes.PUBLIC,
			fakePreAuthenticationEnabled: true,
			fakePreAuthenticationRolePrefix: ""
		};

		let httpRequest$: Observable<StarkSingleItemResponseWrapper<Request> | StarkCollectionResponseWrapper<Request>>;

		if (type === "singleItem") {
			httpRequest$ = this.httpService.executeSingleItemRequest({
				backend: backend,
				resourcePath: "requests/11",
				headers: new Map<string, string>(),
				queryParameters: new Map<string, StarkQueryParam>(),
				requestType: StarkHttpRequestType.GET,
				serializer: serializer,
				retryCount: 4
			});
		} else if (type === "singleNonExistingItem") {
			httpRequest$ = this.httpService.executeSingleItemRequest({
				backend: backend,
				resourcePath: "requests/55",
				headers: new Map<string, string>(),
				queryParameters: new Map<string, StarkQueryParam>(),
				requestType: StarkHttpRequestType.GET,
				serializer: serializer,
				retryCount: 0
			});
		} else {
			httpRequest$ = this.httpService.executeCollectionRequest({
				backend: backend,
				resourcePath: "requests",
				headers: new Map<string, string>(),
				queryParameters: new Map<string, StarkQueryParam>(),
				requestType: StarkHttpRequestType.GET_COLLECTION,
				serializer: serializer,
				retryCount: 4
			});
		}

		httpRequest$.subscribe(
			(response: any) => console.log("---------- SUCCESS", response),
			(error: StarkHttpErrorWrapper) => this.loggingService.error("Error while executing the http call.", error.httpError),
			() => this.loggingService.debug("---------- COMPLETE")
		);
	}
}
