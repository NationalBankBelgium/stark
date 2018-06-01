import { Component, Inject, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkErrorImpl, StarkLoggingService } from "@nationalbankbelgium/stark-core";

import { AppState } from "../app.service";

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
	public constructor(public appState: AppState, @Inject(STARK_LOGGING_SERVICE) public loggingService: StarkLoggingService) {}

	public ngOnInit(): void {
		this.loggingService.debug("hello from `Home` component");
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
}
