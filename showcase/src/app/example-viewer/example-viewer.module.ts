import { NgModule } from "@angular/core";
import { StarkPrettyPrintModule } from "@nationalbankbelgium/stark-ui";
import { ExampleViewerComponent } from "./components";
import { SharedModule } from "../shared";
import { UIRouterModule } from "@uirouter/angular";
import { TsIconsModule } from "@nationalbankbelgium/stark-ui/src/modules/ts-icons";
import { mdiLink, mdiCodeTags } from "@nationalbankbelgium/mdi-ts";

@NgModule({
	imports: [StarkPrettyPrintModule, SharedModule, UIRouterModule.forChild(), TsIconsModule.forChild([mdiLink, mdiCodeTags])],
	declarations: [ExampleViewerComponent],
	exports: [ExampleViewerComponent, StarkPrettyPrintModule]
})
export class ExampleViewerModule {}
