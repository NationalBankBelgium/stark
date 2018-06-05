import { UIRouter, Category, StateDeclaration } from "@uirouter/core";
import { Visualizer } from "@uirouter/visualizer";

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

export function routerConfigFn(router: UIRouter): void {
	router.trace.enable(Category.TRANSITION);
	router.plugin(Visualizer);

	logRegisteredStates(router.stateService.get());
}

export function routerChildConfigFn(router: UIRouter): void {
	logRegisteredStates(router.stateService.get());
}
