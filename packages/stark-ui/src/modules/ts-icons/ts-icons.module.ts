import { Inject, InjectionToken, ModuleWithProviders, NgModule, makeEnvironmentProviders } from "@angular/core";
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { mdiIcon } from "@nationalbankbelgium/mdi-ts";

export const ICONS_PROVIDER = new InjectionToken<mdiIcon[][]>("iconsProviders");

@NgModule({
	imports: [MatIconModule]
})
export class TsIconsModule {
	public constructor(iconRegistry: MatIconRegistry, domSanitizer: DomSanitizer, @Inject(ICONS_PROVIDER) iconsToInject: mdiIcon[][]) {
		iconsToInject.forEach((icons) => {
			icons.forEach((icon) => {
				iconRegistry.addSvgIconLiteral(icon.name, domSanitizer.bypassSecurityTrustHtml(icon.data));
			});
		});
	}

	// eslint-disable-next-line sonarjs/no-identical-functions
	public static forRoot(mdiIcons: mdiIcon[]): ModuleWithProviders<TsIconsModule> {
		return {
			ngModule: TsIconsModule,
			providers: [makeEnvironmentProviders([{ provide: ICONS_PROVIDER, useValue: mdiIcons, multi: true }])]
		};
	}

	// eslint-disable-next-line sonarjs/no-identical-functions
	public static forChild(mdiIcons: mdiIcon[]): ModuleWithProviders<TsIconsModule> {
		return {
			ngModule: TsIconsModule,
			providers: [makeEnvironmentProviders([{ provide: ICONS_PROVIDER, useValue: mdiIcons, multi: true }])]
		};
	}
}
