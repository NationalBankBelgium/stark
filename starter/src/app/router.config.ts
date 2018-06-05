import { UIRouter, Category, StateDeclaration } from "@uirouter/core";
import { Visualizer } from "@uirouter/visualizer";

/**
 * This method will log all registered states of the application
 * @param registeredstates: a set of registered states
 */
function logRegisteredStates(registeredstates: StateDeclaration[]): void {
	let message: string = "=============  Registered Ui-Router states: ==============\n";

	for (const state of registeredstates) {
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
 * @ignore
 * @param router - the router to configure
 */
export function routerConfigFn(router: UIRouter): void {
	router.trace.enable(Category.TRANSITION);

	// TODO switch on/off depending on environment (DEVELOPMENT = ON)
	router.plugin(Visualizer);

	logRegisteredStates(router.stateService.get());
}

/**
 * @ignore
 */
export function routerChildConfigFn(router: UIRouter): void {
	logRegisteredStates(router.stateService.get());
}
