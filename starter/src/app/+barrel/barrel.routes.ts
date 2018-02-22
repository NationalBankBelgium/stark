import { BarrelComponent } from "./barrel.component";
import { Ng2StateDeclaration } from "@uirouter/angular";

export const BARREL_STATES: Ng2StateDeclaration[] = [
	{ name: "barrel", url: "/barrel", component: BarrelComponent },
	{
		name: "childBarrel.**",
		url: "/child-barrel",
		loadChildren: "./+child-barrel/child-barrel.module#ChildBarrelModule"
	}
];
