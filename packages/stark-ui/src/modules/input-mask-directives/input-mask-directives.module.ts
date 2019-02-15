import { NgModule } from "@angular/core";
import { StarkEmailMaskDirective, StarkNumberMaskDirective, StarkTextMaskDirective, StarkTimestampMaskDirective } from "./directives";

@NgModule({
	declarations: [StarkEmailMaskDirective, StarkNumberMaskDirective, StarkTextMaskDirective, StarkTimestampMaskDirective],
	exports: [StarkEmailMaskDirective, StarkNumberMaskDirective, StarkTextMaskDirective, StarkTimestampMaskDirective]
})
export class StarkInputMaskDirectivesModule {}
