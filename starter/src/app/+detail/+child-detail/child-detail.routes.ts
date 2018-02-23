import { ChildDetailComponent } from "./child-detail.component";
import { Ng2StateDeclaration } from "@uirouter/angular";

export const CHILD_DETAIL_STATES: Ng2StateDeclaration[] = [
	{ name: "childDetail", url: "/child-detail", parent: "detail", component: ChildDetailComponent }
];
