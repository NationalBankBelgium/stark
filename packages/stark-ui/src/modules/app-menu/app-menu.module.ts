import { NgModule } from "@angular/core";
import { StarkAppMenuComponent, StarkAppMenuItemComponent } from "./components";
import { TranslateModule } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { StarkSvgViewBoxModule } from "../svg-view-box/svg-view-box.module";
import { UIRouterModule } from "@uirouter/angular";

@NgModule({
	declarations: [StarkAppMenuComponent, StarkAppMenuItemComponent],
	imports: [
		BrowserAnimationsModule,
		CommonModule,
		MatListModule,
		MatDividerModule,
		MatExpansionModule,
		MatIconModule,
		StarkSvgViewBoxModule,
		TranslateModule,
		UIRouterModule
	],
	exports: [StarkAppMenuComponent, StarkAppMenuItemComponent]
})
export class StarkAppMenuModule {}
