import { NgModule } from "@angular/core";
import { StarkPrettyPrintModule } from "@nationalbankbelgium/stark-ui";
import { ExampleViewerComponent } from "./components";
import { SharedModule } from "../shared";
import { UIRouterModule } from "@uirouter/angular";

@NgModule({
	imports: [StarkPrettyPrintModule, SharedModule, UIRouterModule.forChild()],
	declarations: [ExampleViewerComponent],
	exports: [ExampleViewerComponent, StarkPrettyPrintModule]
})
export class ExampleViewerModule {}
