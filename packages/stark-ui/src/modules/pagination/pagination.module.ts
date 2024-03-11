import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatPaginatorModule } from "@angular/material/paginator";
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
