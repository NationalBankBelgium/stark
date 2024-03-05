import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatLegacyInputModule as MatInputModule } from "@angular/material/legacy-input";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MatLegacyTooltipModule as MatTooltipModule } from "@angular/material/legacy-tooltip";
import { MatLegacyPaginatorModule as MatPaginatorModule } from "@angular/material/legacy-paginator";
import { StarkPaginationComponent } from "./components";
import { StarkRestrictInputDirectiveModule } from "@nationalbankbelgium/stark-ui/src/modules/restrict-input-directive";
import { StarkDropdownModule } from "@nationalbankbelgium/stark-ui/src/modules/dropdown";

@NgModule({
	declarations: [StarkPaginationComponent],
	exports: [StarkPaginationComponent],
	imports: [
		CommonModule,
		FormsModule,
		MatButtonModule,
		MatIconModule,
		MatInputModule,
		MatPaginatorModule,
		MatTooltipModule,
		StarkRestrictInputDirectiveModule,
		StarkDropdownModule
	]
})
export class StarkPaginationModule {}
