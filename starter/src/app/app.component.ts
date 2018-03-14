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
	encapsulation: ViewEncapsulation.None,
	styleUrls: ["./app.component.css"],
	template: `
    <nav>
      <a uiSref="index"
        uiSrefActive="active">
        Index
      </a>
      <a uiSref="home"
        uiSrefActive="active">
        Home
      </a>
      <a uiSref="detail"
        uiSrefActive="active">
        Detail
      </a>
      <a uiSref="barrel"
        uiSrefActive="active">
        Barrel
      </a>
      <a uiSref="about" [uiParams]="{ paramData: 'data passed via params' }"
        uiSrefActive="active">
        About
      </a>
      <a *ngIf="showDevModule" uiSref="devModuleDefault"
         uiSrefActive="active">
        DevModule
      </a>
    </nav>

    <main>
      <ui-view></ui-view>
    </main>

    <pre class="app-state">this.appState.state = {{ appState.state | json }}</pre>

    <footer>
      <span>Angular Starter by <a [href]="twitter">@gdi2290</a></span>
      <div>
        <a [href]="url">
          <img [src]="tipe" width="25%">
        </a>
      </div>
    </footer>
  `
})
export class AppComponent implements OnInit {
	public name = "Angular Starter";
	public tipe = "assets/img/tipe.png";
	public twitter = "https://twitter.com/gdi2290";
	public url = "https://tipe.io";
	public showDevModule: boolean = environment.showDevModule;

	constructor(public appState: AppState) {}

	public ngOnInit() {
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
