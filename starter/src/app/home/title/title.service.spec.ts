import { inject, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Title } from "./title.service";

describe("Title", () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [Title]
		});
	});

	it(
		"should have http",
		inject([Title], (title: Title) => {
			expect(!!title.http).toEqual(true);
		})
	);

	it(
		"should get data from the server",
		inject([Title], (title: Title) => {
			spyOn(console, "log");
			expect(console.log).not.toHaveBeenCalled();

			title.getData();
			expect(console.log).toHaveBeenCalled();
			title.getData().subscribe(result => {
				expect(result).toEqual({ value: "AngularClass" });
			});
		})
	);
});
