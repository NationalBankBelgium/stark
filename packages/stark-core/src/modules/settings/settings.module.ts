import { NgModule } from "@angular/core";
import { ActionReducerMap, StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";

import { settingsReducer, StarkSettingsState } from "./reducers";
import { StarkSettingsActions } from "./actions";
import { StarkSettingsServiceImpl, starkSettingsServiceName } from "./services";
import { StarkSettingsEffects } from "./effects";

const reducers: ActionReducerMap<StarkSettingsState, StarkSettingsActions> = {
	settings: settingsReducer
};

@NgModule({
	imports: [StoreModule.forFeature("StarkSettings", reducers), EffectsModule.forFeature([StarkSettingsEffects])],
	declarations: [],
	providers: [{ provide: starkSettingsServiceName, useClass: StarkSettingsServiceImpl }]
})
export class SettingsModule {}
