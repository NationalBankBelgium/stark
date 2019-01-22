import { ApplicationInitStatus, Inject, ModuleWithProviders, NgModule, Optional, SkipSelf } from "@angular/core";
import { CommonModule, Location } from "@angular/common";
import { StoreModule } from "@ngrx/store";
import { UIRouterModule } from "@uirouter/angular";
import { NgIdleModule } from "@ng-idle/core";
import { NgIdleKeepaliveModule } from "@ng-idle/keepalive";
import { from } from "rxjs";
import { starkSessionReducers } from "./reducers";
import { STARK_SESSION_CONFIG, StarkSessionConfig } from "./entities";
import { STARK_SESSION_SERVICE, StarkSessionServiceImpl } from "./services";
import { STARK_ROUTING_SERVICE, StarkRoutingService } from "../routing/services";
import { SESSION_STATES } from "./routes";
import { starkLoginStateName, starkPreloadingStateName } from "./constants";
import { StarkAppContainerComponent } from "./components";

@NgModule({
	imports: [
		CommonModule,
		NgIdleModule.forRoot(),
		NgIdleKeepaliveModule.forRoot(),
		StoreModule.forFeature("StarkSession", starkSessionReducers),
		UIRouterModule.forChild({
			states: SESSION_STATES
		})
	],
	declarations: [StarkAppContainerComponent],
	exports: [StarkAppContainerComponent]
})
export class StarkSessionModule {
	/**
	 * Instantiates the services only once since they should be singletons
	 * so the forRoot() should be called only by the AppModule
	 * @link https://angular.io/guide/singleton-services#forroot
	 * @param sessionConfig - Object containing the configuration (if any) for the Session service
	 * @returns a module with providers
	 */
	public static forRoot(sessionConfig?: StarkSessionConfig): ModuleWithProviders {
		return {
			ngModule: StarkSessionModule,
			providers: [
				Location,
				{ provide: STARK_SESSION_SERVICE, useClass: StarkSessionServiceImpl },
				sessionConfig ? { provide: STARK_SESSION_CONFIG, useValue: sessionConfig } : []
			]
		};
	}

	/**
	 * Prevents this module from being re-imported
	 * @link https://angular.io/guide/singleton-services#prevent-reimport-of-the-coremodule
	 * @param parentModule - the parent module
	 * @param routingService - The routing service of the application
	 * @param sessionConfig - The configuration of the session module
	 * @param appInitStatus - A class that reflects the state of running {@link APP_INITIALIZER}s
	 */
	public constructor(
		@Optional()
		@SkipSelf()
		parentModule: StarkSessionModule,
		@Inject(STARK_ROUTING_SERVICE) routingService: StarkRoutingService,
		appInitStatus: ApplicationInitStatus,
		@Optional()
		@Inject(STARK_SESSION_CONFIG)
		sessionConfig?: StarkSessionConfig
	) {
		if (parentModule) {
			throw new Error("StarkSessionModule is already loaded. Import it in the AppModule only");
		}

		// this logic cannot be executed in an APP_INITIALIZER factory because the StarkRoutingService uses the StarkLoggingService
		// which needs the "logging" state to be already defined in the Store (which NGRX defines internally via APP_INITIALIZER factories :p)
		from(appInitStatus.donePromise).subscribe(() => {
			if (ENV === "development") {
				const loginStateName: string = this.getStateName(
					starkLoginStateName,
					sessionConfig ? sessionConfig.loginStateName : undefined
				);
				routingService.navigateTo(loginStateName);
			} else {
				const preloadingStateName: string = this.getStateName(
					starkPreloadingStateName,
					sessionConfig ? sessionConfig.preloadingStateName : undefined
				);
				routingService.navigateTo(preloadingStateName);
			}
		});
	}

	/**
	 * @ignore
	 */
	private getStateName(defaultState: string, configState?: string): string {
		let finalStateName: string = defaultState;

		if (typeof configState !== "undefined" && configState !== "") {
			finalStateName = configState;
		}

		return finalStateName;
	}
}
