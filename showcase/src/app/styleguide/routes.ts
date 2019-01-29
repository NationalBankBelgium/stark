import { Ng2StateDeclaration } from "@uirouter/angular";
import {
	StyleguideButtonPageComponent,
	StyleguideCardPageComponent,
	StyleguideColorsPageComponent,
	StyleguideHeaderPageComponent,
	StyleguideTypographyPageComponent,
	StyleguideLayoutPageComponent
} from "./pages";

export const STYLEGUIDE_STATES: Ng2StateDeclaration[] = [
	{ name: "styleguide", url: "^/styleguide", abstract: true, parent: "app" },
	{
		name: "styleguide.button",
		url: "/button",
		data: {
			translationKey: "SHOWCASE.STYLEGUIDE.BUTTON.TITLE"
		},
		views: { "@": { component: StyleguideButtonPageComponent } }
	},
	{
		name: "styleguide.card",
		url: "/card",
		data: {
			translationKey: "SHOWCASE.STYLEGUIDE.CARD.TITLE"
		},
		views: { "@": { component: StyleguideCardPageComponent } }
	},
	{
		name: "styleguide.colors",
		url: "/colors",
		data: {
			translationKey: "SHOWCASE.STYLEGUIDE.COLORS.TITLE"
		},
		views: { "@": { component: StyleguideColorsPageComponent } }
	},
	{
		name: "styleguide.stark-header",
		url: "/stark-header",
		data: {
			translationKey: "SHOWCASE.STYLEGUIDE.HEADER.TITLE"
		},
		views: { "@": { component: StyleguideHeaderPageComponent } }
	},
	{
		name: "styleguide.typography",
		url: "/typography",
		data: {
			translationKey: "SHOWCASE.STYLEGUIDE.TYPOGRAPHY.TITLE"
		},
		views: { "@": { component: StyleguideTypographyPageComponent } }
	},
	{
		name: "styleguide.layout",
		url: "/layout",
		data: {
			translationKey: "SHOWCASE.STYLEGUIDE.LAYOUT.TITLE"
		},
		views: { "@": { component: StyleguideLayoutPageComponent } }
	}
];
