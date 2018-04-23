/**
 * Angular 2 decorators and services
 */
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { environment } from "../environments/environment";
import { AppState } from "./app.service";

/**
 * App Component
 * Top Level Component
 */
@Component({
	selector: "app",
	/* tslint:disable:use-view-encapsulation */
	encapsulation: ViewEncapsulation.None,
	/* tslint:enable */
	styleUrls: ["./app.component.css"],
	templateUrl: "./app.component.html"
})
export class AppComponent implements OnInit {
	public name: string = "Angular Starter";
	public tipe: string = "assets/img/tipe.png";
	public twitter: string = "https://twitter.com/gdi2290";
	public url: string = "https://tipe.io";
	public showDevModule: boolean = environment.showDevModule;

	public appState: AppState;

	public constructor(appState: AppState) {
		this.appState = appState;
	}

	public ngOnInit(): void {
		console.log("Initial App State", this.appState.state);
	}
}

/**
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
