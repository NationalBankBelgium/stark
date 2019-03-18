import { Component } from "@angular/core";

@Component({
	selector: "demo-collapsible",
	templateUrl: "./demo-collapsible.component.html"
})
export class DemoCollapsibleComponent {
	public collapsed: boolean[] = [true, false, true];

	public constructor() {
		// empty constructor
	}

	public toggleCollapsible(nb: number): void {
		this.collapsed[nb] = !this.collapsed[nb];
	}
}
