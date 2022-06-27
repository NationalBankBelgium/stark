import { NgModule } from "@angular/core";

import { IMaskModule } from "angular-imask";
import { StarkEmailMaskDirective, StarkNumberMaskDirective, StarkTextMaskDirective, StarkTimestampMaskDirective } from "./directives";

@NgModule({
	declarations: [StarkEmailMaskDirective, StarkNumberMaskDirective, StarkTextMaskDirective, StarkTimestampMaskDirective],
	imports: [IMaskModule],
	exports: [StarkEmailMaskDirective, StarkNumberMaskDirective, StarkTextMaskDirective, StarkTimestampMaskDirective]
})
export class StarkInputMaskDirectivesModule {}
