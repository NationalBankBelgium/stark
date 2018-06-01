// Config from https://github.com/angular/angular-cli/wiki/stories-configure-hmr
// Maybe we should use this: https://github.com/gdi2290/angular-hmr

import { NgModuleRef, ApplicationRef, ComponentRef } from "@angular/core";
import { createNewHosts } from "@angularclass/hmr";

export const hmrBootstrap: any = (module: any, bootstrap: () => Promise<NgModuleRef<any>>) => {
	let ngModule: NgModuleRef<any>;
	module.hot.accept();
	bootstrap().then(
		(mod: NgModuleRef<any>) => (ngModule = mod),
		(reason: any) => console.error("HMR bootstrap: bootstrap failed due to ", reason)
	);
	module.hot.dispose(() => {
		const appRef: ApplicationRef = ngModule.injector.get(ApplicationRef);
		const elements: ComponentRef<any>[] = appRef.components.map((c: ComponentRef<any>) => c.location.nativeElement);
		const makeVisible: () => void = createNewHosts(elements);
		ngModule.destroy();
		makeVisible();
	});
};
