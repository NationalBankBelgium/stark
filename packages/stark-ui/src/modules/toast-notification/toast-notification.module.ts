import { ModuleWithProviders, NgModule, Optional, SkipSelf } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { TranslateModule } from "@ngx-translate/core";
import {
	STARK_TOAST_NOTIFICATION_OPTIONS,
	STARK_TOAST_NOTIFICATION_SERVICE,
	StarkToastNotificationOptions,
	StarkToastNotificationServiceImpl
} from "./services";
import { StarkToastNotificationComponent } from "./components";

@NgModule({
	declarations: [StarkToastNotificationComponent],
	imports: [CommonModule, MatButtonModule, MatIconModule, MatSnackBarModule, TranslateModule],
	exports: [StarkToastNotificationComponent]
})
export class StarkToastNotificationModule {
	/**
	 * Instantiates the services only once since they should be singletons
	 * so the `forRoot()` should be called only by the `AppModule`.
	 *
	 * See {@link https://v12.angular.io/guide/singleton-services#the-forroot-pattern|Angular docs: The `forRoot()` pattern}
	 * @param defaultToastNotificationOptions - `StarkToastNotificationOptions` object
	 * @returns A module with providers
	 */
	public static forRoot(
		defaultToastNotificationOptions?: StarkToastNotificationOptions
	): ModuleWithProviders<StarkToastNotificationModule> {
		return {
			ngModule: StarkToastNotificationModule,
			providers: [
				{ provide: STARK_TOAST_NOTIFICATION_SERVICE, useClass: StarkToastNotificationServiceImpl },
				{ provide: STARK_TOAST_NOTIFICATION_OPTIONS, useValue: defaultToastNotificationOptions }
			]
		};
	}

	/**
	 * Prevent this module from being re-imported
	 * See {@link https://v12.angular.io/guide/singleton-services#prevent-reimport-of-the-greetingmodule|Angular docs: Prevent reimport of a root module}
	 * @param parentModule - The parent module
	 */
	public constructor(
		@Optional()
		@SkipSelf()
		parentModule?: StarkToastNotificationModule
	) {
		if (parentModule) {
			throw new Error("StarkToastNotificationModule is already loaded. Import it in the AppModule only");
		}
	}
}
