import { Component, EventEmitter, Inject, Input, OnInit, Output } from "@angular/core";
import { StarkSearchFormComponent } from "@nationalbankbelgium/stark-ui";
import { HeroMovieSearchCriteria } from "../entities";
import { FormBuilder, FormGroup } from "@angular/forms";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { DemoGenericService } from "../services";
import { take } from "rxjs/operators";

const componentName: string = "demo-generic-search-form";

@Component({
	selector: "demo-generic-search-form",
	templateUrl: "./demo-generic-search-form.component.html"
})
export class DemoGenericSearchFormComponent implements OnInit, StarkSearchFormComponent<HeroMovieSearchCriteria> {
	@Input()
	public searchCriteria: HeroMovieSearchCriteria = <any>{};

	@Output()
	public workingCopyChanged: EventEmitter<HeroMovieSearchCriteria> = new EventEmitter();

	public yearOptions: number[] = [];
	public heroOptions: string[] = [];
	public movieOptions: string[] = [];

	public searchForm: FormGroup;

	public constructor(
		@Inject(STARK_LOGGING_SERVICE) private logger: StarkLoggingService,
		private genericService: DemoGenericService,
		private formBuilder: FormBuilder
	) {}

	public ngOnInit(): void {
		this.searchForm = this.formBuilder.group({
			year: this.searchCriteria.year,
			hero: this.searchCriteria.hero,
			movie: this.searchCriteria.movie
		});

		this.searchForm.valueChanges.subscribe(() => {
			const modifiedCriteria: HeroMovieSearchCriteria = this.mapFormGroupToSearchCriteria(this.searchForm);
			this.workingCopyChanged.emit(modifiedCriteria);
		});

		this.genericService
			.getHeroes()
			.pipe(take(1))
			.subscribe((heroes: string[]) => (this.heroOptions = heroes));
		this.genericService
			.getYears()
			.pipe(take(1))
			.subscribe((years: number[]) => (this.yearOptions = years));
		this.genericService
			.getMovies()
			.pipe(take(1))
			.subscribe((movies: string[]) => (this.movieOptions = movies));

		this.logger.debug(componentName + " is initialized");
	}

	public mapFormGroupToSearchCriteria(formGroup: FormGroup): HeroMovieSearchCriteria {
		/// return formGroup.getRawValue();

		return {
			year: formGroup.controls["year"].value,
			hero: formGroup.controls["hero"].value,
			movie: formGroup.controls["movie"].value
		};
	}

	/**
	 * @ignore
	 */
	public trackItemFn(item: string): string {
		return item;
	}
}
