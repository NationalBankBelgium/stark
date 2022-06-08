import { NgModule } from "@angular/core";

import { IMaskModule } from "angular-imask";
import { StarkTextMaskNewDirective } from "./directives/text-mask-new.directive";
import { StarkNumberMaskNewDirective } from "./directives/number-mask-new.directive";
import { StarkEmailMaskNewDirective } from "./directives/email-mask-new.directive";

@NgModule({
	declarations: [StarkTextMaskNewDirective, StarkNumberMaskNewDirective, StarkEmailMaskNewDirective],
	imports: [IMaskModule],
	exports: [StarkTextMaskNewDirective, StarkNumberMaskNewDirective, StarkEmailMaskNewDirective]
})
export class StarkInputMaskDirectivesModuleNew {}
