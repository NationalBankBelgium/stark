import { NgModule } from "@angular/core";
import { UIRouterModule } from "@uirouter/angular";
import { SharedModule } from "../shared/shared.module";
import { STYLEGUIDE_STATES } from "./routes";
import {
	StyleguideButtonPageComponent,
	StyleguideCardPageComponent,
	StyleguideColorsPageComponent,
	StyleguideHeaderPageComponent,
	StyleguideLayoutPageComponent,
	StyleguideTypographyPageComponent
} from "./pages";
import { ExampleViewerModule } from "../example-viewer";

@NgModule({
    imports: [
        UIRouterModule.forChild({
            states: STYLEGUIDE_STATES
        }),
        SharedModule,
        ExampleViewerModule
    ],
    providers: [],
    declarations: [
        StyleguideButtonPageComponent,
        StyleguideCardPageComponent,
        StyleguideTypographyPageComponent,
        StyleguideColorsPageComponent,
        StyleguideHeaderPageComponent,
        StyleguideLayoutPageComponent
    ],
    exports: [
        StyleguideButtonPageComponent,
        StyleguideCardPageComponent,
        StyleguideTypographyPageComponent,
        StyleguideColorsPageComponent,
        StyleguideHeaderPageComponent,
        StyleguideLayoutPageComponent
    ]
})
export class StyleguideModule {}
