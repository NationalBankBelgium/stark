import { Category, StateDeclaration, UIRouter } from "@uirouter/core";
import { Visualizer } from "@uirouter/visualizer"
export function logRegisteredStates(registeredStates: StateDeclaration[]): void {
	let message = "=============  Registered Ui-Router states: ==============\n";

	for (const state of registeredStates) {
		message += `State : ${state.name} [parent: ${state.parent}, url: ${state.url}, abstract: ${state.abstract}]\n`;
	}
	message += "=======================================================";
	console.log(message);
}

export function routerConfigFn(router: UIRouter): void {
	router.trace.enable(Category.TRANSITION);
	// Enable UI-Router visualizer here if needed (for development purposes only)
	if (ENV === "development") {
		router.plugin(Visualizer);  // Visualizer should be imported from "@uirouter/visualizer"
	}
}

export function routerChildConfigFn(router: UIRouter): void {
	logRegisteredStates(router.stateService.get());
}
