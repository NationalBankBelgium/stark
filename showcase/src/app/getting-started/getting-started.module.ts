import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared";
import { GettingStartedComponent } from "./getting-started-component";
import { MatExpansionModule } from "@angular/material/expansion";
import { StarkPrettyPrintModule } from "@nationalbankbelgium/stark-ui";

@NgModule({
	imports: [CommonModule, SharedModule, MatExpansionModule, StarkPrettyPrintModule],
	declarations: [GettingStartedComponent],
	exports: [GettingStartedComponent]
})
export class GettingStartedModule {}
