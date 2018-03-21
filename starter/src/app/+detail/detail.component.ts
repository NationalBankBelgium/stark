import { Component, OnInit } from "@angular/core";
/**
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */

console.log("`Detail` component loaded asynchronously");

@Component({
	selector: "detail",
	templateUrl: "./detail.component.html"
})
export class DetailComponent implements OnInit {
	public ngOnInit(): void {
		console.log("hello `Detail` component");
	}
}
