import { Inject, NgModule, NgModuleFactoryLoader, SystemJsNgModuleLoader } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { UIRouterModule } from "@uirouter/angular";
import { NgIdleModule } from "@ng-idle/core";
import { NgIdleKeepaliveModule } from "@ng-idle/keepalive";
import { ActionReducer, ActionReducerMap, MetaReducer, StoreModule } from "@ngrx/store";
import { storeFreeze } from "ngrx-store-freeze";
import { storeLogger } from "ngrx-store-logger";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import {
	STARK_APP_CONFIG,
	STARK_APP_METADATA,
	STARK_MOCK_DATA,
	STARK_SESSION_SERVICE,
	StarkApplicationConfig,
	StarkApplicationConfigImpl,
	StarkApplicationMetadata,
	StarkApplicationMetadataImpl,
	StarkHttpModule,
	StarkLoggingModule,
	StarkMockData,
	StarkRoutingModule,
	StarkSessionModule,
	StarkSessionService,
	StarkUser
} from "@nationalbankbelgium/stark-core";

import { StarkAppLogoModule } from "@nationalbankbelgium/stark-ui";
import { routerConfigFn } from "./router.config";
import { Deserialize } from "cerialize";
/*
 * Translations
 */
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { initializeTranslation } from "./translation.config";
/*
 * Platform and Environment providers/directives/pipes
 */
import { environment } from "../environments/environment";
import { APP_STATES } from "./app.routes";
// App is our top level component
import { AppComponent } from "./app.component";
import { AppState } from "./app.service";
import { HomeComponent } from "./home";
import { AboutComponent } from "./about";
import { NoContentComponent } from "./no-content";
/* tslint:disable:no-import-side-effect */
// load PCSS styles
import "../styles/styles.pcss";
// load SASS styles
import "../styles/styles.scss";
/* tslint:enable */
import "../styles/headings.css";

// Application wide providers
const APP_PROVIDERS: any[] = [AppState];

// TODO: where to put this factory function?
export function starkAppConfigFactory(): StarkApplicationConfig {
	const config: any = require("../stark-app-config.json");

	const applicationConfig: StarkApplicationConfig = Deserialize(config, StarkApplicationConfigImpl);

	applicationConfig.rootStateUrl = "home";
	applicationConfig.rootStateName = "";
	applicationConfig.homeStateName = "home";
	applicationConfig.errorStateName = "";
	applicationConfig.angularDebugInfoEnabled = true; //DEVELOPMENT;
	applicationConfig.debugLoggingEnabled = true; //DEVELOPMENT;
	applicationConfig.routerLoggingEnabled = true; //DEVELOPMENT;

	return applicationConfig;
}

// TODO: where to put this factory function?
export function starkAppMetadataFactory(): StarkApplicationMetadata {
	const metadata: any = require("../stark-app-metadata.json");

	return Deserialize(metadata, StarkApplicationMetadataImpl);
}

// TODO: where to put this factory function?
export function starkMockDataFactory(): StarkMockData {
	return {
		whatever: "dummy prop",
		profiles: []
	};
}

// Application Redux State
export interface State {
	// reducer interfaces
}

export const reducers: ActionReducerMap<State> = {
	// reducers
};

export function logger(reducer: ActionReducer<State>): any {
	// default, no options
	return storeLogger()(reducer);
}

export const metaReducers: MetaReducer<State>[] = !environment.production ? [logger, storeFreeze] : [];

/**
 * `AppModule` is the main entry point into Angular2's bootstrapping process
 */
@NgModule({
	bootstrap: [AppComponent],
	declarations: [AppComponent, AboutComponent, HomeComponent, NoContentComponent],
	/**
	 * Import Angular's modules.
	 */
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		StoreModule.forRoot(reducers, {
			metaReducers
		}),
		UIRouterModule.forRoot({
			states: APP_STATES,
			useHash: !Boolean(history.pushState),
			otherwise: { state: "otherwise" },
			config: routerConfigFn
		}),
		TranslateModule.forRoot(),
		NgIdleModule.forRoot(),
		NgIdleKeepaliveModule.forRoot(), // FIXME: disabled in stark-app-config.json for now until json-server is integrated
		StarkHttpModule.forRoot(),
		StarkLoggingModule.forRoot(),
		StarkSessionModule.forRoot(),
		StarkRoutingModule.forRoot(),
		StarkAppLogoModule
	],
	/**
	 * Expose our Services and Providers into Angular's dependency injection.
	 */
	providers: [
		environment.ENV_PROVIDERS,
		APP_PROVIDERS,
		{ provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader }, // needed for ui-router
		{ provide: STARK_APP_CONFIG, useFactory: starkAppConfigFactory },
		{ provide: STARK_APP_METADATA, useFactory: starkAppMetadataFactory },
		{ provide: STARK_MOCK_DATA, useFactory: starkMockDataFactory }
	]
})
export class AppModule {
	public constructor(
		private translateService: TranslateService,
		@Inject(STARK_SESSION_SERVICE) private sessionService: StarkSessionService
	) {
		initializeTranslation(this.translateService);

		const user: StarkUser = {
			uuid: "abc123",
			username: "John",
			firstName: "Doe",
			lastName: "Smith",
			roles: ["dummy role"]
		};
		this.sessionService.login(user);
	}
}
