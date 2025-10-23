import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MatIconModule } from "@angular/material/icon";
import { MatLegacyMenuModule as MatMenuModule } from "@angular/material/legacy-menu";
import { MatLegacyTooltipModule as MatTooltipModule } from "@angular/material/legacy-tooltip";
import { StarkActionBarComponent } from "./components";
import { TranslateModule } from "@ngx-translate/core";
import { TsIconsModule } from "@nationalbankbelgium/stark-ui/src/modules/ts-icons";
import { mdiDotsHorizontal, mdiDotsVertical } from "@nationalbankbelgium/mdi-ts";

@NgModule({
	declarations: [StarkActionBarComponent],
	imports: [
		CommonModule,
		MatButtonModule,
		MatIconModule,
		MatMenuModule,
		MatTooltipModule,
		TranslateModule,
		TsIconsModule.forChild([mdiDotsHorizontal, mdiDotsVertical])
	],
	exports: [StarkActionBarComponent]
})
export class StarkActionBarModule {}
