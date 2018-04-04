import { NgModule } from "@angular/core";
import {StarkRoutingServiceImpl, starkRoutingServiceName} from "./services";

@NgModule({
	imports: [],
	declarations: [],
	providers: [{ provide: starkRoutingServiceName, useClass: StarkRoutingServiceImpl }]
})
export class LoggingModule {}
