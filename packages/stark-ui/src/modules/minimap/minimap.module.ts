import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { StarkMinimapComponent } from "./components";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { MatMenuModule } from "@angular/material/menu";

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
