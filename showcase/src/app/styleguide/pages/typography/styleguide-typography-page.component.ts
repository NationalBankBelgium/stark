import { Component, Inject, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";

@Component({
	selector: "demo-typography",
	templateUrl: "./styleguide-typography-page.component.html"
})
export class StyleguideTypographyPageComponent implements OnInit {
	public fontFamilyCSS: string;
	public fontFaceExample: string;
	public webpackExample: string;
	public customizeMap: string;

	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {}

	public ngOnInit(): void {
		this.fontFamilyCSS = `
			  font-family: "BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif";
		`;

		this.fontFaceExample = `
		@font-face {
		  font-family: "Roboto";
		  font-style: "Regular";
		  src: url("/assets/fonts/Roboto-Regular.ttf") format("truetype")
		}
		
		$stark-typography-theme: (
		  font-family: "'Roboto',  sans-serif",
		);
	 	`;

		this.webpackExample = `
		{
			"cspConnectSrc": "http://localhost:5000 http://localhost:5001 http://localhost:5002 http://localhost:4000 https://nationalbankbelgium.github.io",
			"cspFormAction": "http://localhost:5000/myAwesomeUpload",
			"cspFontSrc": "http://fonts.gstatic.com"
		}
		`;

		this.customizeMap = `
		$stark-typography-theme: (
			font-family: "BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
			display-4: (112px, 112px, 300),
			display-3: (56px, 56px, 400),
			display-2: (45px, 48px, 400),
			display-1: (34px, 40px, 400),
			headline: (24px, 32px, 400),
			title: (20px, 32px, 500),
			subheading-2: (16px, 28px, 400),
			subheading-1: (15px, 24px, 400),
			body-2: (16px, 32px, 500),
			body-1: (16px, 28px, 400),
			caption: (12px, 20px, 400),
			button: (14px, 14px, 500),
			input:(inherit, 1.125, 400)
		  );

		@import "~@nationalbankbelgium/stark-ui/assets/themes/theming";
		`;
	}
}
