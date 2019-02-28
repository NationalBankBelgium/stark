import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { StarkSearchFormComponent } from "@nationalbankbelgium/stark-ui";
import { HeroMovieSearchCriteria } from "../entities";
import { FormBuilder, FormGroup } from "@angular/forms";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { DemoGenericService } from "../services";
import { take } from "rxjs/operators";

const _isEqual: Function = require("lodash/isEqual");
const componentName: string = "demo-generic-search-form";

@Component({
	selector: "demo-generic-search-form",
	templateUrl: "./demo-generic-search-form.component.html"
})
export class DemoGenericSearchFormComponent implements OnInit, OnChanges, StarkSearchFormComponent<HeroMovieSearchCriteria> {
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
		this.searchForm = this.createSearchForm(this.searchCriteria);

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

	public ngOnChanges(changes: SimpleChanges): void {
		if (
			changes["searchCriteria"] &&
			!changes["searchCriteria"].isFirstChange() &&
			!_isEqual(changes["searchCriteria"].previousValue, this.searchCriteria)
		) {
			this.resetSearchForm(this.searchCriteria);
		}
	}

	public createSearchForm(searchCriteria: HeroMovieSearchCriteria): FormGroup {
		return this.formBuilder.group({
			year: searchCriteria.year,
			hero: searchCriteria.hero,
			movie: searchCriteria.movie
		});
	}

	public resetSearchForm(searchCriteria: HeroMovieSearchCriteria): void {
		// reset the form fields but don't emit a "change" event to statusChanges and valueChanges to avoid infinite loops!
		this.searchForm.reset(
			{
				year: searchCriteria.year,
				hero: searchCriteria.hero,
				movie: searchCriteria.movie
			},
			{ emitEvent: false }
		);
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
