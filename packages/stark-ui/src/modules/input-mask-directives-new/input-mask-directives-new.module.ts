import { NgModule } from "@angular/core";

import { IMaskModule } from "angular-imask";
import { StarkTextMaskNewDirective } from "./directives/text-mask-new.directive";
import { StarkNumberMaskNewDirective } from "./directives/number-mask-new.directive";
import { StarkEmailMaskNewDirective } from "./directives/email-mask-new.directive";
import { StarkTimestampMaskNewDirective } from "./directives/timestamp-mask.directive";

@NgModule({
	declarations: [StarkTextMaskNewDirective, StarkNumberMaskNewDirective, StarkEmailMaskNewDirective, StarkTimestampMaskNewDirective],
	imports: [IMaskModule],
	exports: [StarkTextMaskNewDirective, StarkNumberMaskNewDirective, StarkEmailMaskNewDirective, StarkTimestampMaskNewDirective]
})
export class StarkInputMaskDirectivesModuleNew {}
