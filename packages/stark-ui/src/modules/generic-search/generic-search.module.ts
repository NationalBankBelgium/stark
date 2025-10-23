import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MatIconModule } from "@angular/material/icon";
import { MatLegacyTooltipModule as MatTooltipModule } from "@angular/material/legacy-tooltip";
import { TranslateModule } from "@ngx-translate/core";
import { StarkGenericSearchComponent } from "./components";
import { StarkActionBarModule } from "@nationalbankbelgium/stark-ui/src/modules/action-bar";
import { TsIconsModule } from "@nationalbankbelgium/stark-ui/src/modules/ts-icons";
import { mdiMagnify, mdiNotePlus, mdiUndo } from "@nationalbankbelgium/mdi-ts";

@NgModule({
	declarations: [StarkGenericSearchComponent],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatIconModule,
		MatTooltipModule,
		StarkActionBarModule,
		TranslateModule,
		TsIconsModule.forChild([mdiMagnify, mdiNotePlus, mdiUndo])
	],
	exports: [StarkGenericSearchComponent]
})
export class StarkGenericSearchModule {}
