import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map, delay } from "rxjs/operators";
import { StarkGenericSearchService, StarkSearchState } from "@nationalbankbelgium/stark-ui";
import { HeroMovie, HeroMovieSearchCriteria } from "../entities";
import { DemoGenericSearchState, selectDemoGenericSearch } from "../reducers";
import { Store, select } from "@ngrx/store";
import { DemoGenericSearchActions } from "../actions";

const MOVIES: HeroMovie[] = [
	{
		uuid: "92aa85a2-8dd6-471c-9619-c723aae0c1af",
		year: 2018,
		hero: "Black Panther",
		movie: "Black Panther"
	},
	{
		uuid: "df56f965-504d-48c0-b248-5c8b4c69cfc8",
		year: 2017,
		hero: "Wonder Woman",
		movie: "Wonder Woman"
	},
	{
		uuid: "98115c72-c91d-4eaa-bba9-c63ec2e20bb0",
		year: 2015,
		hero: "Ant-Man",
		movie: "Ant-Man"
	},
	{
		uuid: "1f803cfd-e40e-4d7b-b1f3-a932e5db7e23",
		year: 2008,
		hero: "Iron Man",
		movie: "Iron Man"
	},
	{
		uuid: "147429b2-4054-43f2-bced-2f745a7a42fe",
		year: 2008,
		hero: "Batman",
		movie: "The Dark Knight"
	},
	{
		uuid: "35a352df-cda6-430e-9a50-aff765df368b",
		year: 1989,
		hero: "Batman",
		movie: "Batman"
	},
	{
		uuid: "973b6a41-193b-46a4-bd6b-2961808a416b",
		year: 2010,
		hero: "Iron Man",
		movie: "Iron Man 2"
	},
	{
		uuid: "b8503839-66b0-4041-bc03-1a580b086cd5",
		year: 2013,
		hero: "Iron Man",
		movie: "Iron Man 3"
	}
];

@Injectable()
export class DemoGenericService implements StarkGenericSearchService<HeroMovie, HeroMovieSearchCriteria> {
	public constructor(private store: Store<DemoGenericSearchState>) {}

	public getSearchState(): Observable<StarkSearchState<HeroMovieSearchCriteria>> {
		return this.store.pipe(select(selectDemoGenericSearch));
	}

	public resetSearchState(): void {
		this.store.dispatch(DemoGenericSearchActions.removeCriteria());
		this.store.dispatch(DemoGenericSearchActions.hasSearchedReset());
	}

	public search(criteria: HeroMovieSearchCriteria): Observable<HeroMovie[]> {
		this.store.dispatch(DemoGenericSearchActions.setCriteria({criteria}));
		this.store.dispatch(DemoGenericSearchActions.hasSearched());

		return of(MOVIES).pipe(
			// The delay is important to show the progress-indicator during the search process.
			delay(1000),
			map((genericObjects: HeroMovie[]) => {
				return genericObjects.filter((genericObject: HeroMovie) =>
					criteria.year ? genericObject.year.toString().match(new RegExp(criteria.year, "gi")) : true
				);
			}),
			map((genericObjects: HeroMovie[]) => {
				return genericObjects.filter((genericObject: HeroMovie) =>
					criteria.hero ? genericObject.hero.match(new RegExp(criteria.hero, "gi")) : true
				);
			}),
			map((genericObjects: HeroMovie[]) => {
				return genericObjects.filter((genericObject: HeroMovie) =>
					criteria.movie ? genericObject.movie.match(new RegExp(criteria.movie, "gi")) : true
				);
			})
		);
	}

	public getHeroes(): Observable<string[]> {
		const heroes: string[] = [];

		for (const genericObject of MOVIES) {
			if (!heroes.includes(genericObject.hero)) {
				heroes.push(genericObject.hero);
			}
		}

		return of(heroes.sort());
	}

	public getMovies(): Observable<string[]> {
		const movies: string[] = [];

		for (const genericObject of MOVIES) {
			if (!movies.includes(genericObject.movie)) {
				movies.push(genericObject.movie);
			}
		}

		return of(movies.sort());
	}

	public getYears(): Observable<number[]> {
		const years: number[] = [];

		for (const genericObject of MOVIES) {
			if (!years.includes(genericObject.year)) {
				years.push(genericObject.year);
			}
		}

		// tslint:disable-next-line:no-alphabetical-sort
		return of(years.sort());
	}
}
