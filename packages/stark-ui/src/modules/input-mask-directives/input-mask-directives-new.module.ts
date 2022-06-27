import { NgModule } from "@angular/core";

import { IMaskModule } from "angular-imask";
import { StarkTextMaskDirective } from "./directives/text-mask.directive";
import { StarkNumberMaskDirective } from "./directives/number-mask.directive";
import { StarkEmailMaskDirective } from "./directives/email-mask.directive";
import { StarkTimestampMaskDirective } from "./directives/timestamp-mask.directive";

@NgModule({
	declarations: [StarkTextMaskDirective, StarkNumberMaskDirective, StarkEmailMaskDirective, StarkTimestampMaskDirective],
	imports: [IMaskModule],
	exports: [StarkTextMaskDirective, StarkNumberMaskDirective, StarkEmailMaskDirective, StarkTimestampMaskDirective]
})
export class StarkInputMaskDirectivesModuleNew {}
