import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { StarkMinimapComponent } from "./components";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MatLegacyCheckboxModule as MatCheckboxModule } from "@angular/material/legacy-checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatLegacyTooltipModule as MatTooltipModule } from "@angular/material/legacy-tooltip";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { MatLegacyMenuModule as MatMenuModule } from "@angular/material/legacy-menu";

@NgModule({
	declarations: [StarkMinimapComponent],
	imports: [
		CommonModule,
		FormsModule,
		MatButtonModule,
		MatCheckboxModule,
		MatIconModule,
		MatTooltipModule,
		MatMenuModule,
		TranslateModule
	],
	exports: [StarkMinimapComponent]
})
export class StarkMinimapModule {}
