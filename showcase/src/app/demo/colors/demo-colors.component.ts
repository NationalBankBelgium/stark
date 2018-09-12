import { Component, Inject, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";

@Component({
	selector: "showcase-demo-colors",
	templateUrl: "./demo-colors.component.html"
})
export class DemoColorsComponent implements OnInit {
	public simpleMap: string;
	public advancedMap: string;

	public constructor(@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService) {}

	public ngOnInit(): void {
		this.advancedMap = `
            @import "~@angular/material/theming";

            $dark-primary-text: rgba(black, 0.87);
            $light-primary-text: white;

            $primary-palette: (
                50: #e3f2fd,
                100: #bbdefb,
                200: #90caf9,
                300: #64b5f6,
                400: #42a5f5,
                500: #0076c8,
                600: #006ab4,
                700: #005ea0,
                800: #1565c0,
                900: #143e74,
                A100: #82b1ff,
                A200: #448aff,
                A400: #2979ff,
                A700: #2962ff,
                contrast: (
                    50: $dark-primary-text,
                    100: $dark-primary-text,
                    200: $dark-primary-text,
                    300: $dark-primary-text,
                    400: $dark-primary-text,
                    500: $light-primary-text,
                    600: $light-primary-text,
                    700: $light-primary-text,
                    800: $light-primary-text,
                    900: $light-primary-text,
                    A100: $dark-primary-text,
                    A200: $light-primary-text,
                    A400: $light-primary-text,
                    A700: $light-primary-text
                )
            );
            $accent-palette: (
                50: #ff99c2,
                100: #ff4d94,
                200: #f48fb1,
                300: #f06292,
                400: #ec407a,
                500: #8f0039,
                600: #70002d,
                700: #c2185b,
                800: #ad1457,
                900: #880e4f,
                A100: #ff80ab,
                A200: #ff4081,
                A400: #f50057,
                A700: #c51162,
                contrast: (
                    50: $dark-primary-text,
                    100: $dark-primary-text,
                    200: $dark-primary-text,
                    300: $dark-primary-text,
                    400: $dark-primary-text,
                    500: $light-primary-text,
                    600: $light-primary-text,
                    700: $light-primary-text,
                    800: $light-primary-text,
                    900: $light-primary-text,
                    A100: $dark-primary-text,
                    A200: $light-primary-text,
                    A400: $light-primary-text,
                    A700: $light-primary-text
                )
            );
            $warning-palette: (
                50: #fff3e0,
                100: #ffe0b2,
                200: #ffcc80,
                300: #ffb74d,
                400: #ffa726,
                500: #ff9800,
                600: #fb8c00,
                700: #f57c00,
                800: #ef6c00,
                900: #e65100,
                A100: #ffd180,
                A200: #ffab40,
                A400: #ff9100,
                A700: #ff6d00,
                contrast: (
                    50: $dark-primary-text,
                    100: $dark-primary-text,
                    200: $dark-primary-text,
                    300: $dark-primary-text,
                    400: $dark-primary-text,
                    500: $light-primary-text,
                    600: $light-primary-text,
                    700: $light-primary-text,
                    800: $light-primary-text,
                    900: $light-primary-text,
                    A100: $dark-primary-text,
                    A200: $dark-primary-text,
                    A400: $dark-primary-text,
                    A700: black
                )
            );

            $stark-base-theme: (
                primary-palette: mat-palette($primary-palette),
                accent-palette: mat-palette($accent-palette),
                warn-palette: mat-palette($warning-palette)
            );

            @import "~@nationalbankbelgium/stark-ui/assets/themes/theming";
        `;

		this.simpleMap = `
            $dark-primary-text: rgba(black, 0.87);
            $light-primary-text: white;

            $stark-color-theme: (
                accent: (
                color: #8f0039,
                contrast: $light-primary-text
                ),
                alert: (
                color: #d32f2f,
                contrast: $light-primary-text
                ),
                alt: (
                color: #323232,
                contrast: $light-primary-text
                ),
                neutral: (
                color: #bfbfbf,
                contrast: $light-primary-text
                ),
                primary: (
                color: #0076c8,
                contrast: $light-primary-text
                ),
                success: (
                color: #4caf50,
                contrast: $light-primary-text
                ),
                warning: (
                color: #ff9800,
                contrast: $light-primary-text
                ),
                white-transp: (
                color: rgba(255, 255, 255, 0.87),
                contrast: $dark-primary-text
                )
            );

            @import "~@nationalbankbelgium/stark-ui/assets/themes/theming";
		`;
	}
}
