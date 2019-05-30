import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { TranslateModule } from "@ngx-translate/core";
import { UIRouterModule } from "@uirouter/angular";
import { StarkAppMenuComponent, StarkAppMenuItemComponent } from "./components";

@NgModule({
	declarations: [StarkAppMenuComponent, StarkAppMenuItemComponent],
	imports: [CommonModule, MatListModule, MatDividerModule, MatExpansionModule, MatIconModule, TranslateModule, UIRouterModule],
	exports: [StarkAppMenuComponent, StarkAppMenuItemComponent]
})
export class StarkAppMenuModule {}
