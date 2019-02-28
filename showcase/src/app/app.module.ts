import { APP_INITIALIZER, Inject, NgModule, NgModuleFactoryLoader, SystemJsNgModuleLoader } from "@angular/core";
import { BrowserModule, DomSanitizer } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { UIRouter, UIRouterModule } from "@uirouter/angular";
import { ActionReducer, ActionReducerMap, MetaReducer, StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { EffectsModule } from "@ngrx/effects";
import { storeFreeze } from "ngrx-store-freeze";
import { storeLogger } from "ngrx-store-logger";
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatListModule } from "@angular/material/list";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DateAdapter } from "@angular/material/core";
import { Observable, of } from "rxjs";
import { filter, map } from "rxjs/operators";

import {
	STARK_APP_CONFIG,
	STARK_APP_METADATA,
	STARK_MOCK_DATA,
	STARK_SESSION_SERVICE,
	STARK_SETTINGS_SERVICE,
	StarkApplicationConfig,
	StarkApplicationConfigImpl,
	StarkApplicationMetadata,
	StarkApplicationMetadataImpl,
	StarkErrorHandlingModule,
	StarkHttpModule,
	StarkLoggingActionTypes,
	StarkLoggingModule,
	StarkMockData,
	starkPreloadingStateName,
	StarkRoutingModule,
	StarkSessionModule,
	StarkSessionService,
	StarkSettingsModule,
	StarkSettingsService,
	StarkUser,
	StarkUserModule,
	StarkXSRFModule
} from "@nationalbankbelgium/stark-core";

import {
	StarkAppDataModule,
	StarkAppFooterModule,
	StarkAppLogoModule,
	StarkAppLogoutModule,
	StarkAppMenuModule,
	StarkAppSidebarModule,
	StarkDatePickerModule,
	StarkLanguageSelectorModule,
	StarkMessagePaneModule,
	StarkMinimapModule,
	StarkProgressIndicatorModule,
	StarkRouteSearchModule,
	StarkSessionUiModule,
	StarkToastNotificationModule
} from "@nationalbankbelgium/stark-ui";
import { SharedModule } from "./shared/shared.module";
import { InMemoryDataModule } from "./in-memory-data/in-memory-data.module";
import { WelcomeModule } from "./welcome/welcome.module";
import { logRegisteredStates, routerConfigFn } from "./router.config";
import { registerMaterialIconSet } from "./material-icons.config";
import { Deserialize } from "cerialize";
import { StarkErrorHandlingEffects } from "./shared/effects";
/*
 * Translations
 */
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { initializeTranslation } from "./translation.config";
/*
 * DEV Authentication
 */
import { getAuthenticationHeaders } from "./authentication.config";
/*
 * Platform and Environment providers/directives/pipes
 */
import { environment } from "../environments/environment";
import { APP_STATES } from "./app.routes";
// App is our top level component
import { AppComponent } from "./app.component";

// TODO: where to put this factory function?
export function starkAppConfigFactory(): StarkApplicationConfig {
	const config: any = require("../stark-app-config.json");

	const applicationConfig: StarkApplicationConfig = Deserialize(config, StarkApplicationConfigImpl);

	applicationConfig.rootStateUrl = "/";
	applicationConfig.rootStateName = "";
	applicationConfig.homeStateName = "home";
	applicationConfig.errorStateName = "otherwise";
	applicationConfig.angularDebugInfoEnabled = true; // DEVELOPMENT;
	applicationConfig.debugLoggingEnabled = true; // DEVELOPMENT;
	applicationConfig.routerLoggingEnabled = true; // DEVELOPMENT;

	return applicationConfig;
}

// TODO: where to put this factory function?
export function starkAppMetadataFactory(): StarkApplicationMetadata {
	const metadata: any = require("../stark-app-metadata.json");

	return Deserialize(metadata, StarkApplicationMetadataImpl);
}

// TODO: where to put this factory function?
export function starkMockDataFactory(): StarkMockData {
	if (ENV === "development") {
		return require("../../config/json-server/data.json");
	} else {
		return {};
	}
}

export function initRouterLog(router: UIRouter): Function {
	return () => logRegisteredStates(router.stateService.get());
}

export function getXsrfWaitBeforePinging(sessionService: StarkSessionService): Observable<any> {
	let waitFor$: Observable<any> = of("production"); // no need to wait on production

	if (ENV !== "production") {
		// wait for the user to be logged in (useful when targeting a live backend on DEV)
		waitFor$ = sessionService.getCurrentUser().pipe(
			filter((user?: StarkUser) => typeof user !== "undefined"),
			map(() => {
				return "dev login";
			})
		);
	}

	return waitFor$;
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
	return storeLogger({
		filter: {
			blacklist: [StarkLoggingActionTypes.LOG_MESSAGE]
		}
	})(reducer);
}

export const metaReducers: MetaReducer<State>[] = ENV !== "production" ? [logger, storeFreeze] : [];

/**
 * `AppModule` is the main entry point into Angular's bootstrapping process
 */
@NgModule({
	bootstrap: [AppComponent],
	declarations: [AppComponent],
	/**
	 * Import Angular's modules.
	 */
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatCardModule,
		MatCheckboxModule,
		MatExpansionModule,
		MatIconModule,
		MatListModule,
		MatTooltipModule,
		StoreModule.forRoot(reducers, {
			metaReducers
		}),
		// store dev tools instrumentation must be imported AFTER StoreModule
		StoreDevtoolsModule.instrument({
			maxAge: 50, // retains last 50 states
			name: "Stark Showcase - NgRx Store DevTools", // shown in the monitor page
			logOnly: environment.production // restrict extension to log-only mode (setting it to false enables all extension features)
		}),
		EffectsModule.forRoot([StarkErrorHandlingEffects]), // needed to set up the providers required for effects
		UIRouterModule.forRoot({
			states: APP_STATES,
			useHash: !Boolean(history.pushState),
			otherwise: "otherwise",
			config: routerConfigFn
		}),
		TranslateModule.forRoot(),
		StarkHttpModule.forRoot(),
		StarkLoggingModule.forRoot(),
		StarkSessionModule.forRoot({
			loginStateName: starkPreloadingStateName // get rid of the Login page in the Showcase :-)
		}),
		StarkErrorHandlingModule.forRoot(),
		StarkSettingsModule.forRoot(),
		StarkRoutingModule.forRoot(),
		StarkUserModule.forRoot(),
		StarkXSRFModule.forRoot({
			waitBeforePinging: {
				waitBeforePingingFn: getXsrfWaitBeforePinging,
				deps: [STARK_SESSION_SERVICE]
			}
		}),
		SharedModule,
		WelcomeModule,
		StarkAppFooterModule,
		StarkAppDataModule,
		StarkAppLogoModule,
		StarkAppLogoutModule,
		StarkAppMenuModule,
		StarkAppSidebarModule.forRoot(),
		StarkLanguageSelectorModule,
		StarkMessagePaneModule.forRoot(),
		StarkDatePickerModule,
		StarkMinimapModule,
		StarkProgressIndicatorModule.forRoot(),
		StarkRouteSearchModule,
		StarkToastNotificationModule.forRoot({
			delay: 5000,
			position: "top right",
			actionClasses: []
		}),
		StarkSessionUiModule.forRoot(),
		InMemoryDataModule
	],
	/**
	 * Expose our Services and Providers into Angular's dependency injection.
	 */
	providers: [
		environment.ENV_PROVIDERS,
		{ provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader }, // needed for ui-router
		{ provide: STARK_APP_CONFIG, useFactory: starkAppConfigFactory },
		{ provide: STARK_APP_METADATA, useFactory: starkAppMetadataFactory },
		{ provide: STARK_MOCK_DATA, useFactory: starkMockDataFactory },
		{ provide: APP_INITIALIZER, useFactory: initRouterLog, multi: true, deps: [UIRouter] }
	]
})
export class AppModule {
	public constructor(
		private translateService: TranslateService,
		private dateAdapter: DateAdapter<any>,
		@Inject(STARK_SESSION_SERVICE) private sessionService: StarkSessionService,
		@Inject(STARK_SETTINGS_SERVICE) private settingsService: StarkSettingsService,
		matIconRegistry: MatIconRegistry,
		domSanitizer: DomSanitizer
	) {
		initializeTranslation(this.translateService, this.dateAdapter);
		registerMaterialIconSet(matIconRegistry, domSanitizer);

		this.settingsService.initializeSettings();

		sessionService
			.getCurrentUser()
			.pipe(filter((user?: StarkUser): user is StarkUser => typeof user !== "undefined"))
			.subscribe((user: StarkUser) => {
				const devAuthenticationHeaders: Map<string, string> = getAuthenticationHeaders(user);
				this.sessionService.setDevAuthenticationHeaders(devAuthenticationHeaders);
			});
	}
}
