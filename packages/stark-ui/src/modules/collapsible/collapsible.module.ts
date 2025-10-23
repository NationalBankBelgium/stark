import { NgModule } from "@angular/core";
import { StarkCollapsibleComponent } from "./components";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { TsIconsModule } from "@nationalbankbelgium/stark-ui/src/modules/ts-icons";
import { mdiChevronRight } from "@nationalbankbelgium/mdi-ts";

@NgModule({
	declarations: [StarkCollapsibleComponent],
	imports: [CommonModule, MatExpansionModule, MatIconModule, TranslateModule, TsIconsModule.forChild([mdiChevronRight])],
	exports: [StarkCollapsibleComponent]
})
export class StarkCollapsibleModule {}
