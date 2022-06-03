import { NgModule } from "@angular/core";

import { IMaskModule } from "angular-imask";
import { StarkTextMaskNewDirective } from "./directives/text-mask-new.directive";
import { StarkNumberMaskNewDirective } from "./directives/number-mask-new.directive";

@NgModule({
	declarations: [StarkTextMaskNewDirective, StarkNumberMaskNewDirective],
	imports: [IMaskModule],
	exports: [StarkTextMaskNewDirective, StarkNumberMaskNewDirective]
})
export class StarkInputMaskDirectivesModuleNew {}
