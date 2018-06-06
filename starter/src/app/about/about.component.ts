import { Component, Inject, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { StarkLoggingService, STARK_LOGGING_SERVICE } from "@nationalbankbelgium/stark-core";

@Component({
	selector: "about",
	styles: [``],
	templateUrl: "./about.component.html"
})
export class AboutComponent implements OnInit {
	@Input() public resolvedData: Observable<any>;
	@Input() public paramData: any;

	public constructor(@Inject(STARK_LOGGING_SERVICE) public loggingService: StarkLoggingService) {}

	public ngOnInit(): void {
		this.loggingService.debug("hello from the `About` component");
	}
}
