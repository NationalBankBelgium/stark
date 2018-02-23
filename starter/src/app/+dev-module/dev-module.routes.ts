import { DevModuleComponent } from "./dev-module.component";
import { Ng2StateDeclaration } from "@uirouter/angular";

export const DEV_MODULE_STATES: Ng2StateDeclaration[] = [{ name: "devModuleDefault", url: "/dev-module", component: DevModuleComponent }];
