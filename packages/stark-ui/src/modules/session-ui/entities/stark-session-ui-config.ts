import { InjectionToken } from "@angular/core";

/**
 * The InjectionToken version of the config name
 */
export const STARK_SESSION_UI_CONFIG: InjectionToken<StarkSessionUiConfig> = new InjectionToken<StarkSessionUiConfig>(
	"StarkSessionUiConfig"
);

/**
 * Definition of the configuration object for the Stark Session UI module
 */
export class StarkSessionUiConfig {
	/**
	 * Whether the warning dialog should be displayed or not.
	 * If true, then the Ngrx Effects in charge of displaying the dialog won't be executed.
	 */
	public timeoutWarningDialogDisabled?: boolean;
}
