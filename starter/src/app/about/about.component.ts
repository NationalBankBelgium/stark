import { Component, Input, OnInit } from "@angular/core";
// import { Transition } from '@uirouter/angular';
import { Observable } from "rxjs/Observable";

@Component({
	selector: "about",
	styles: [
		`
  `
	],
	template: `
    <h1>About</h1>
    <div>
      For hot module reloading run
      <pre>npm run start:hmr</pre>
    </div>
    <div>
      <h3>
		  https://github.com/NationalBankBelgium/stark
      </h3>
    </div>
    <pre>this.localState = {{ localState | json }}</pre>
  `
})
export class AboutComponent implements OnInit {
	@Input() public resolvedData: Observable<any>;
	@Input() public paramData: any;

	public localState: any;
	constructor() // public transition: Transition   // the last transition could be injected if needed
	{
		/* empty */
	}

	public ngOnInit() {
		/**
		 * Getting the params values
		 */
		this.localState = { ...this.localState, paramData: this.paramData };
		// OR get params values from the transition itself
		// this.localState = {...this.localState, paramData: this.transition.params().paramData};

		/**
		 * Getting the resolves values
		 */
		// if the resolve is an observable, we need to subscribe to it to get the value
		if (this.resolvedData) {
			this.resolvedData.subscribe((data: any) => {
				console.warn("data resolved");
				this.localState = { ...this.localState, ...data };
			});
		}

		// if the resolve is a promise and the resolve policy is WAIT
		// the value is already available
		// this.localState = {...this.localState, ...this.resolvedData};

		// OR get resolved values from the transition itself
		// this.localState = {...this.localState, ...this.transition.injector().get('resolvedData')};

		// if the resolve is a promise and the resolve policy is NOWAIT
		// the promise MUST be accessed via the transition itself
		// let resolvePromise: Promise<any> = this.transition.injector().get('resolvedData');
		// resolvePromise.then((data: any) => this.localState = {...this.localState, ...data});

		console.log("hello `About` component");
		/**
		 * static data that is bundled
		 * var mockData = require('assets/mock-data/mock-data.json');
		 * console.log('mockData', mockData);
		 * if you're working with mock data you can also use http.get('assets/mock-data/mock-data.json')
		 */
		this.asyncDataWithWebpack();
	}
	private asyncDataWithWebpack(): void {
		/**
		 * you can also async load mock data with 'es6-promise-loader'
		 * you would do this if you don't want the mock-data bundled
		 * remember that 'es6-promise-loader' is a promise
		 */
		// setTimeout(() => {
		// 	System.import("../../assets/mock-data/mock-data.json").then(json => {
		// 		console.log("async mockData", json);
		// 		this.localState = { ...this.localState, asyncData: json };
		// 	});
		// });
	}
}
