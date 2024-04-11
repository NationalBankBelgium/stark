import { Component, EventEmitter, Inject, Input, OnInit, Output } from "@angular/core";
import { StarkSearchFormComponent } from "@nationalbankbelgium/stark-ui";
import { HeroMovieSearchCriteria } from "../entities";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { DemoGenericService } from "../services";
import { take } from "rxjs/operators";
import isEqual from "lodash-es/isEqual";

const componentName = "demo-generic-search-form";

@Component({
	selector: "demo-generic-search-form",
	templateUrl: "./demo-generic-search-form.component.html"
})
export class DemoGenericSearchFormComponent implements OnInit, StarkSearchFormComponent<HeroMovieSearchCriteria> {
	@Input()
	public set searchCriteria(value: HeroMovieSearchCriteria) {
		if (isEqual(value, this._searchCriteria)) {
			return;
		}

		this._searchCriteria = value;
		this.resetSearchForm(this._searchCriteria);
	}
	public get searchCriteria(): HeroMovieSearchCriteria {
		return this._searchCriteria;
	}
	public _searchCriteria: HeroMovieSearchCriteria = {};

	@Output()
	public readonly workingCopyChanged = new EventEmitter<HeroMovieSearchCriteria>();

	public yearOptions: number[] = [];
	public heroOptions: string[] = [];
	public movieOptions: string[] = [];

	public searchForm: UntypedFormGroup;

	public constructor(
		@Inject(STARK_LOGGING_SERVICE) private logger: StarkLoggingService,
		private genericService: DemoGenericService,
		private formBuilder: UntypedFormBuilder
	) {
		this.searchForm = this.createSearchForm(this.searchCriteria);
	}

	public ngOnInit(): void {
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

	public createSearchForm(searchCriteria: HeroMovieSearchCriteria): UntypedFormGroup {
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

	public mapFormGroupToSearchCriteria(formGroup: UntypedFormGroup): HeroMovieSearchCriteria {
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
	public trackItemFn(_index: number, item: string | number): string | number {
		return item;
	}
}
