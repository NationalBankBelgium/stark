import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { StarkActionBarComponent } from "./components";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
	declarations: [StarkActionBarComponent],
	imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule, TranslateModule],
	exports: [StarkActionBarComponent]
})
export class StarkActionBarModule {}
