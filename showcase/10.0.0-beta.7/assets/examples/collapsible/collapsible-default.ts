import { Component } from "@angular/core";

@Component({
	selector: "demo-collapsible",
	templateUrl: "./demo-collapsible.component.html"
})
export class DemoCollapsibleComponent {
	public collapsed: boolean = false;

	public toggleCollapsible(): void {
		this.collapsed = !this.collapsed;
	}
}
