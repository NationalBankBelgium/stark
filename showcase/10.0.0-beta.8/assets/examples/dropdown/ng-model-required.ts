import { Component } from "@angular/core";

@Component({
	selector: "demo-dropdown",
	templateUrl: "./demo-dropdown.component.html"
})
export class DemoDropdownComponent {
	public serviceDropdownOptions = [
		{ id: "PR", value: "IT applications" },
		{ id: "IO", value: "Informatics infrastructure and operations" },
		{ id: "CS", value: "IT customer services" }
	];

	public selectedService = "";
}
