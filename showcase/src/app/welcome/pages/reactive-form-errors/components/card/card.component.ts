import { Component, HostBinding, Input } from "@angular/core";

type Colors =  "primary" | "accent" | "warning" | "success";

@Component({
	selector: "app-card",
	templateUrl: "./card.component.html",
	styleUrls: ["./card.component.scss"]
})

export class CardComponent {
	@HostBinding("class.app-color-primary")
	public primaryColor!: boolean;
	@HostBinding("class.app-color-accent")
	public accentColor!: boolean;
	@HostBinding("class.app-color-warning")
	public warningColor!: boolean;
	@HostBinding("class.app-color-success")
	public successColor!: boolean;
	
	@Input()
	public set color(color: Colors) {
		this.primaryColor = false;
		this.accentColor = false;
		this.warningColor = false;
		this.successColor = false;

		switch (color) {
			case "primary":
				this.primaryColor = true;
				break;
			case "accent":
				this.accentColor = true;
				break;
			case "warning":
				this.warningColor = true;
				break;
			case "success":
				this.successColor = true;
				break;
			default:
				break;
		}
	}
}
