import { HomeComponent } from "./home";
import { AboutComponent } from "./about";
import { NoContentComponent } from "./no-content";
import { Ng2StateDeclaration, Transition } from "@uirouter/angular";
import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";

export function getResolvedData(): Observable<any> {
	console.warn("resolve data being fetched... please wait...");
	// could return an observable but then the component should subscribe to it
	// if resolve policy = 'WAIT' or 'NOWAIT' the component WILL BE LOADED WITHOUT
	// WAITING FOR THE OBSERVABLE TO EMIT
	// if resolve policy = 'RXWAIT', the component WILL BE LOADED UNTIL THE OBSERVABLE EMITS
	return of({ resolve: "I am data from the resolve" }).pipe(delay(5000));

	// could return a promise
	// when resolve policy is 'WAIT', the component WILL BE LOADED UNTIL THE PROMISE
	// IS RESOLVED and the value will be already unwrapped
	// when resolve policy is 'NOWAIT', the component WILL BE LOADED WITHOUT
	// WAITING FOR IT but the component should unwrap the promise
	// return of({ resolve: 'I am data from the resolve'}).pipe(delay(5000)).toPromise();
}

export function getParamData($transition$: Transition): any {
	return $transition$.params().paramData;
}

export const APP_STATES: Ng2StateDeclaration[] = [
	{ name: "index", url: "/", component: HomeComponent },
	{ name: "home", url: "/home", component: HomeComponent },
	{
		name: "about",
		url: "/about",
		component: AboutComponent,
		params: {
			paramData: "should be replaced by the actual param value",
			resolvedData: { resolve: "should be replaced by the actual resolved value" }
		},
		resolve: [
			{
				token: "resolvedData",
				deps: [],
				resolveFn: getResolvedData,
				policy: {
					// a resolve policy can be used depending of the returning value: promise or observable
					// See https://ui-router.github.io/ng2/docs/latest/interfaces/resolve.resolvepolicy.html
					// FIXME: 'RXWAIT' throws an error: https://github.com/ui-router/angular/issues/211
					async: "WAIT" // default (to be used for promises) although observables work also!
				}
			},
			{
				token: "paramData",
				deps: [Transition],
				resolveFn: getParamData
			}
		]
	},
	{ name: "detail.**", url: "/detail", loadChildren: "./+detail/detail.module#DetailModule" },
	{ name: "barrel.**", url: "/barrel", loadChildren: "./+barrel/barrel.module#BarrelModule" },
	{ name: "otherwise", url: "/otherwise", component: NoContentComponent }
];
