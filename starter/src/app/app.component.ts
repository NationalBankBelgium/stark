/**
 * Angular 2 decorators and services
 */
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { AppState } from "./app.service";

/**
 * App Component
 * Top Level Component
 */
@Component({
	selector: "app",
	// tslint:disable-next-line:use-view-encapsulation
	encapsulation: ViewEncapsulation.None,
	styleUrls: ["./app.component.css"],
	templateUrl: "./app.component.html"
})
/**
 * AppComponent file
 */
export class AppComponent implements OnInit {
	/**
	 * Name of the project
	 */
	public name: string = "Stark Starter";
	/**
	 * Url of the project
	 */
	public url: string = "https://github.com/NationalBankBelgium/stark";

	/**
	 * The application state
	 */
	public appState: AppState;

	public constructor(appState: AppState) {
		this.appState = appState;
	}

	/**
	 * Triggered on the component's initialization
	 */
	public ngOnInit(): void {
		console.log("Initial App State", this.appState.state);
	}
}
