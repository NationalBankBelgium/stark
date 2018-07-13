import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule } from "@angular/material";
import { StarkSvgViewBoxModule } from "../svg-view-box/svg-view-box.module";
import { StarkActionBarComponent } from "./components";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
	declarations: [StarkActionBarComponent],
	imports: [BrowserModule, StarkSvgViewBoxModule, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule, TranslateModule],
	exports: [StarkActionBarComponent]
})
export class StarkActionBarModule {}
