import { Ng2StateDeclaration } from "@uirouter/angular";
import {
	StyleguideTypographyPageComponent,
	StyleguideCardPageComponent,
	StyleguideButtonPageComponent,
	StyleguideHeaderPageComponent,
	StyleguideColorsPageComponent
} from "./pages";

export const STYLEGUIDE_STATES: Ng2StateDeclaration[] = [
	{ name: "styleguide", url: "^/styleguide", abstract: true, parent: "app" },
	{
		name: "styleguide.button",
		url: "/button",
		views: { "@": { component: StyleguideButtonPageComponent } }
	},
	{
		name: "styleguide.card",
		url: "/card",
		views: { "@": { component: StyleguideCardPageComponent } }
	},
	{
		name: "styleguide.colors",
		url: "/colors",
		views: { "@": { component: StyleguideColorsPageComponent } }
	},
	{
		name: "styleguide.stark-header",
		url: "/stark-header",
		views: { "@": { component: StyleguideHeaderPageComponent } }
	},
	{
		name: "styleguide.typography",
		url: "/typography",
		views: { "@": { component: StyleguideTypographyPageComponent } }
	}
];
