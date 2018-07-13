import { UIRouter, Category, StateDeclaration } from "@uirouter/core";
import { Visualizer } from "@uirouter/visualizer";

/**
 * This method will log all registered states of the application
 * @param registeredStates - The set of states registered in the UI-Router instance
 */
function logRegisteredStates(registeredStates: StateDeclaration[]): void {
	let message: string = "=============  Registered Ui-Router states: ==============\n";

	for (const state of registeredStates) {
		message += "State : " + state.name;
		message += " [";
		message += "parent: " + state.parent;
		message += ", url: " + state.url;
		message += ", abstract: " + state.abstract;
		message += "]\n";
	}
	message += "=======================================================";
	console.log(message);
}

/**
 * Function called by the UI-Router root module (forRoot()) to set some imperative configuration
 * @param router - The UI-Router instance to configure
 */
export function routerConfigFn(router: UIRouter): void {
	router.trace.enable(Category.TRANSITION);

	// Enable UI-Router visualizer here if needed (for development purposes only)
	if (ENV === "development") {
		router.plugin(Visualizer);
	}

	logRegisteredStates(router.stateService.get());
}

/**
 * Function called by the UI-Router child module (forChild()) to set some imperative configuration
 * @param router - The UI-Router instance to configure
 */
export function routerChildConfigFn(router: UIRouter): void {
	logRegisteredStates(router.stateService.get());
}
