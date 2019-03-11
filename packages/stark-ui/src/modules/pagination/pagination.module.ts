import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatPaginatorModule } from "@angular/material/paginator";
import { StarkPaginationComponent } from "./components";
import { StarkSvgViewBoxModule } from "../svg-view-box/svg-view-box.module";
import { StarkRestrictInputDirectiveModule } from "../restrict-input-directive/restrict-input-directive.module";
import { StarkDropdownModule } from "../dropdown/dropdown.module";

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
		StarkSvgViewBoxModule,
		StarkDropdownModule
	]
})
export class StarkPaginationModule {}
