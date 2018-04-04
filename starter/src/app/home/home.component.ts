import { Component, Inject, OnInit } from "@angular/core";
import {
	StarkBackend,
	StarkBackendAuthenticationTypes,
	StarkCollectionResponseWrapper,
	StarkHttpErrorWrapper,
	StarkHttpRequestType,
	StarkHttpSerializer,
	StarkHttpSerializerImpl,
	StarkHttpService,
	starkHttpServiceName,
	StarkSingleItemResponseWrapper
} from "@nationalbankbelgium/stark-core";
import { Observable } from "rxjs/Observable"

import { AppState } from "../app.service";
import { Title } from "./title";
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
	providers: [Title],
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
	public localState: any = {value: " "};

	/**
	 * TypeScript public modifiers
	 */
	public constructor(public appState: AppState,
					   public title: Title,
					   @Inject(starkHttpServiceName) public httpService: StarkHttpService<any>) {
	}

	public ngOnInit(): void {
		console.log("hello `Home` component");
		/**
		 * this.title.getData().subscribe(data => this.data = data);
		 */
	}

	public submitState(value: string): void {
		console.log("submitState", value);
		this.appState.set("value", value);
		this.localState.value = "";
	}

	public triggerHttpCall(type: "collection" | "singleItem"): void {
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
			httpRequest$ = this.httpService
				.executeSingleItemRequest({
					backend: backend,
					resourcePath: "requests/11",
					headers: new Map<string, string>(),
					queryParameters: new Map<string, string | string[] | undefined>(),
					requestType: StarkHttpRequestType.GET,
					serializer: serializer,
					retryCount: 4
				})
		} else {
			httpRequest$ = this.httpService
				.executeCollectionRequest({
					backend: backend,
					resourcePath: "requests",
					headers: new Map<string, string>(),
					queryParameters: new Map<string, string | string[] | undefined>(),
					requestType: StarkHttpRequestType.GET_COLLECTION,
					serializer: serializer,
					retryCount: 4
				})
		}

		httpRequest$.subscribe(
			(response: any) => console.log("---------- SUCCESS", response),
			(error: StarkHttpErrorWrapper) => console.log("---------- ERROR", error),
			() => console.log("---------- COMPLETE")
		);
	}
}
