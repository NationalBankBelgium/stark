/**
 * App Module
 * our top level module that holds all of our components
 */
import { AppModule } from "./app";

import { AbstractStarkMain } from "@nationalbankbelgium/stark-core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { environment } from "./environments/environment";

/*
 * Bootstrap our Angular app with a top level component `App` and inject
 * our Services and Providers into Angular's dependency injection system
 */
class Main extends AbstractStarkMain {
	public main = (): Promise<any> => {
		if (ENV === "development") {
			console.log("Bootstrapping the App");
		}

		// Bootstrap our Angular app with a top level NgModule
		return (
			platformBrowserDynamic()
				.bootstrapModule(AppModule)
				// the line below adapts the module depending on the environment
				// if you don't like what stark does by default, you can instead do your own customizations through the environment.* files
				// and use environment.customizeAppModule instead
				// eslint-disable-next-line no-invalid-this
				.then(this.decorateModule)
		);
	};
}

new Main(environment).bootstrap();
