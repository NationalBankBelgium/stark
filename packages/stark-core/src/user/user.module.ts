import { NgModule } from "@angular/core";
import { StarkUserServiceImpl, starkUserServiceName } from "./services";

@NgModule({
	imports: [],
	declarations: [],
	providers: [{ provide: starkUserServiceName, useClass: StarkUserServiceImpl }]
})
export class StarkUserModule {}
