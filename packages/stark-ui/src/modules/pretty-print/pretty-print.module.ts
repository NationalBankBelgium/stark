import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StarkPrettyPrintComponent } from "./components";
import { STARK_PRETTY_PRINT_SERVICE, StarkPrettyPrintServiceImpl } from "./services";

@NgModule({
	providers: [
		{
			provide: STARK_PRETTY_PRINT_SERVICE,
			useClass: StarkPrettyPrintServiceImpl
		}
	],
	declarations: [StarkPrettyPrintComponent],
	imports: [CommonModule],
	exports: [StarkPrettyPrintComponent]
})
export class StarkPrettyPrintModule {}
