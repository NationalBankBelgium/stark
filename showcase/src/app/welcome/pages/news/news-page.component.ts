import {Component, HostBinding, Inject, OnInit} from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";

@Component({
	selector: "news",
	templateUrl: "./news-page.component.html"
})
export class NewsPageComponent implements OnInit {
	@HostBinding("class")
	public class: string = "news-page";
	
	public constructor(@Inject(STARK_LOGGING_SERVICE) public loggingService: StarkLoggingService) {}

	public ngOnInit(): void {
		this.loggingService.debug("hello from `News` component");
	}
}
