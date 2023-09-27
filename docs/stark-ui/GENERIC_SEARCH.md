# Stark Generic Search component

## 1. About

This component provides a generic way to handle search flow in your application.
You only need to provide this component with your custom search form via transclusion and the necessary methods to perform the search.
Finally this component will return the results in an Observable that you can subscribe to.

## 2. How to use it

### 2.1. Create an entity for the search (optional)

For using the Generic Search component, you must have an entity that describes your object. For some reasons, the entity which describes the search form could be different than the object and in this case, it is necessary to create a different entity to describe this search object.

This HowTo presents the usage of the Generic Search component with the search entity. Obviously, if you don't need a specific entity for the search, you could just replace the "Search entity" by the entity of your object in the code of the controllers, reducers and services that follow.

#### 2.1.1. Create the entity for your object

For the following example, we need this entity:

```typescript
import { StarkResource } from "@nationalbankbelgium/stark-core";
import { autoserialize } from "cerialize";

export class MovieObject implements StarkResource {
  @autoserialize
  public uuid: string;

  @autoserialize
  public year: number;

  @autoserialize
  public hero: string;

  @autoserialize
  public title: string;
}
```

#### 2.1.2. Create the search entity file

Under the src/app/modules/<module-name>/entities folder create the _type-data_-**search.entity.ts** file.
This entity contains all the fields that the search form will contain to find a specific element in the concerned collection.

```typescript
export class MovieSearchCriteria {
  public year?: string;
  public hero?: string;
  public title?: string;
}
```

### 2.2. Create a form component

Generate your form component in _src/app/modules/<module_name>/components_ by using **ng cli**:

```bash
ng generate component src/app/modules/my_module/components/my_component-search-form
```

#### 2.2.1. Define your component

The component must only have one **input** binding, the object which describes the content of the form.
And the component have the **output** binding "workingCopyChanged" to emit a new value of the search criteria when they change.

```typescript
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { StarkSearchFormComponent } from "@nationalbankbelgium/stark-ui";
import { MovieSearchCriteria } from "../entities";
import { FormBuilder, FormGroup } from "@angular/forms";
import { DEMO_GENERIC_SERVICE, DemoGenericService } from "../services";

const _isEqual: Function = require("lodash/isEqual");

@Component({
  selector: "movie-search-form",
  templateUrl: "./movie-search-form.component.html"
})
export class MovieSearchFormComponent implements OnInit, OnChanges, StarkSearchFormComponent<MovieSearchCriteria> {
  @Input()
  public searchCriteria: MovieSearchCriteria = {};

  @Output()
  public workingCopyChanged: EventEmitter<MovieSearchCriteria> = new EventEmitter();

  public yearOptions: number[] = [];
  public heroOptions: string[] = [];
  public movieOptions: string[] = [];

  public searchForm: FormGroup;

  public constructor(@Inject(DEMO_GENERIC_SERVICE) private genericService: DemoGenericService, private formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    this.searchForm = this.createSearchForm(this.searchCriteria);

    this.searchForm.valueChanges.subscribe(() => {
      const modifiedCriteria: MovieSearchCriteria = this.mapFormGroupToSearchCriteria(this.searchForm);
      this.workingCopyChanged.emit(modifiedCriteria);
    });

    // ...
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

  public createSearchForm(searchCriteria: MovieSearchCriteria): FormGroup {
    return this.formBuilder.group({
      year: searchCriteria.year,
      hero: searchCriteria.hero,
      movie: searchCriteria.movie
    });
  }

  public resetSearchForm(searchCriteria: MovieSearchCriteria): void {
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

  public mapFormGroupToSearchCriteria(formGroup: FormGroup): MovieSearchCriteria {
    // return formGroup.getRawValue();

    return {
      year: formGroup.controls["year"].value,
      hero: formGroup.controls["hero"].value,
      title: formGroup.controls["title"].value
    };
  }

  /**
   * @ignore
   */
  public trackItemFn(item: string): string {
    return item;
  }
}
```

#### 2.2.2. Define your template

```html
<div fxLayout="row wrap">
  <!-- Year -->
  <div fxFlex>
    <mat-form-field>
      <input type="text" placeholder="Year" matInput [formControl]="searchForm.controls['year']" [matAutocomplete]="yearAutocomplete" />
    </mat-form-field>
    <mat-autocomplete #yearAutocomplete="matAutocomplete">
      <mat-option *ngFor="let option of yearOptions; trackBy: trackItemFn" [value]="option">{{ option }}</mat-option>
    </mat-autocomplete>
  </div>
  <!-- Hero -->
  <div fxFlex>
    <mat-form-field>
      <input type="text" placeholder="Hero" matInput [formControl]="searchForm.controls['hero']" [matAutocomplete]="heroAutocomplete" />
    </mat-form-field>
    <mat-autocomplete #heroAutocomplete="matAutocomplete">
      <mat-option *ngFor="let option of heroOptions; trackBy: trackItemFn" [value]="option">{{ option }}</mat-option>
    </mat-autocomplete>
  </div>
  <!-- Movie -->
  <div fxFlex>
    <mat-form-field>
      <input type="text" placeholder="Movie" matInput [formControl]="searchForm.controls['movie']" [matAutocomplete]="movieAutocomplete" />
    </mat-form-field>
    <mat-autocomplete #movieAutocomplete="matAutocomplete">
      <mat-option *ngFor="let option of movieOptions; trackBy: trackItemFn" [value]="option">{{ option }}</mat-option>
    </mat-autocomplete>
  </div>
</div>
```

### 2.3. Create the search actions

#### 2.3.1. Create the following files

Under the `src/app/modules/<module-name>/actions` folder create the files **movies-search.actions.ts** and **index.ts**.

#### 2.3.2. Define the actions

The following actions should be defined to make your GenericSearch working perfectly.

```typescript
import { createAction, props, union } from "@ngrx/store";
import { MovieSearchCriteria } from "../entities";

export const setCriteria = createAction("[MovieSearch] Set criteria", props<{ criteria: MovieSearchCriteria }>());
export const removeCriteria = createAction("[MovieSearch] Remove criteria");
export const hasSearched = createAction("[MovieSearch] Has searched");
export const hasSearchedReset = createAction("[MovieSearch] Has searched reset");

/**
 * @ignore
 */
const all = union({ setCriteria, removeCriteria, hasSearched, hasSearchedReset });
export type Types = typeof all;
```

#### 2.3.3 Export the actions in barrel file

Export all the actions as follows in your barrel (index.ts):

import \* as MovieSearchActions from "./movies-search.actions";
export { MovieSearchActions };

Obviously, you'll have to export everything from your _actions.ts_ file in your barrel (index.ts).

### 2.4. Create the search reducers

#### 2.4.1. Create the following files

Under the `src/app/modules/<module-name>/reducers` folder create the files **movie-search.reducer.ts** and **index.ts**.

#### 2.4.2. Define the search reducer

The reducer must contain the following options.

Don't forget to rename every variable and function that contain "movies" with your used type.

```typescript
import { StarkSearchState } from "@nationalbankbelgium/stark-ui";
import { createReducer, on } from "@ngrx/store";
import { MovieSearchCriteria } from "../entities/movies-search.entity";
import { MovieSearchActions } from "../actions";

const INITIAL_STATE: Readonly<StarkSearchState<MovieSearchCriteria>> = {
  criteria: new MovieSearchCriteria(),
  hasBeenSearched: false
};

const reducer = createReducer<StarkSearchState<MovieSearchCriteria>, MovieSearchActions.Types>(
  INITIAL_STATE,
  on(DemoGenericSearchActions.setCriteria, (state, action) => ({ ...state, criteria: action.criteria })),
  on(DemoGenericSearchActions.removeCriteria, (state) => ({ ...state, criteria: INITIAL_STATE.criteria })),
  on(DemoGenericSearchActions.hasSearched, (state) => ({ ...state, hasBeenSearched: true })),
  on(DemoGenericSearchActions.hasSearchedReset, (state) => ({ ...state, hasBeenSearched: false }))
);

export function movieSearchReducer(
  state: Readonly<StarkSearchState<MovieSearchCriteria>> | undefined,
  action: Readonly<MovieSearchActions.Types>
): Readonly<StarkSearchState<MovieSearchCriteria>> {
  return reducer(state, action);
}
```

#### 2.4.3. Define the search reducers index

Copy the following snippet in your _reducers/index.ts_ file.

Don't forget to rename every variable and function that contain "movies" with your used type.

```typescript
import { StarkSearchState } from "@nationalbankbelgium/stark-ui";
import { ActionReducerMap, createSelector, MemoizedSelector, createFeatureSelector } from "@ngrx/store";
import { MovieSearchCriteria } from "../entities";
import { MovieSearchActions } from "../actions";
import { movieSearchReducer } from "./movie-search.reducer";

export interface MovieSearchState {
  movieSearch: StarkSearchState<MovieSearchCriteria>;
}

export const movieSearchReducers: ActionReducerMap<MovieSearchState, MovieSearchActions.Types> = {
  movieSearch: movieSearchReducer
};

export const selectMovieSearch: MemoizedSelector<object, StarkSearchState<MovieSearchCriteria>> = createSelector(
  createFeatureSelector<MovieSearchState>("MovieSearch"),
  (state: MovieSearchState) => state.movieSearch
);
```

#### 2.4.4. Declare the reducers

In your module file, add the following import to be able to use your reducers.

```typescript
// imports

import { StoreModule } from "@ngrx/store";
import { movieSearchReducers } from "./reducers";

@NgModule({
  imports: [
    // ...
    StoreModule.forFeature("MovieSearch", movieSearchReducers)
  ]
})
export class MyModule {}
```

### 2.5. Create the search service

The search service is an implementation of the Stark Generic Search Service.

It must contain these functions :

- search
- getSearchState
- resetSearchState
- createNew

The search service depends on the _type_.**repository.ts**.

#### 2.5.1. Create the search service

##### 2.5.1.1. Create the interface

You need to create a Search service interface that extends the **StarkGenericSearchService** interface and pass the type of the data in the extension.
Firstly the main entity, **Movie** in this case, and secondly the search entity, **MovieSearch** still for this case.

```typescript
import { MovieObject, MovieSearchCriteria } from "../entities";
import { StarkGenericSearchService } from "@nationalbankbelgium/stark-ui";
import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";

export const movieServiceName: string = "DemoGenericService";
export const MOVIE_SERVICE: InjectionToken<MovieService> = new InjectionToken<MovieService>(movieServiceName);

export interface MovieService extends StarkGenericSearchService<MovieObject, MovieSearchCriteria> {
  getYears(): Observable<number[]>;

  getMovies(): Observable<string[]>;

  getHeroes(): Observable<string[]>;
}
```

##### 2.5.1.2. Create the implementation

You need

```typescript
import { MovieService } from "./demo-generic.service.intf";
import { Inject, Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { StarkSearchState } from "@nationalbankbelgium/stark-ui";
import { MovieObject, MovieSearchCriteria } from "../entities";
import { MovieSearchState, selectMovieSearch } from "../reducers";
import { MOVIE_REPOSITORY, MovieRepository } from "../repositories";
import { Store, select } from "@ngrx/store";
import { MovieSearchActions } from "../actions";

@Injectable()
export class DemoGenericServiceImpl implements MovieService {
  public constructor(private store: Store<MovieSearchState>, @Inject(MOVIE_REPOSITORY) private movieRepository: MovieRepository) {}

  public getSearchState(): Observable<StarkSearchState<MovieSearchCriteria>> {
    return this.store.pipe(select(selectMovieSearch));
  }

  public resetSearchState(): void {
    this.store.dispatch(MovieSearchActions.removeCriteria());
    this.store.dispatch(MovieSearchActions.hasSearchedReset());
  }

  public search(criteria: MovieSearchCriteria): Observable<MovieObject[]> {
    this.store.dispatch(MovieSearchActions.setCriteria({ criteria }));
    this.store.dispatch(MovieSearchActions.hasSearched());

    return this.movieRepository.search(criteria);
  }
}
```

Then don't forget to declare your service in your module :blush:

### 2.6. Create the search component page

Generate your search component page in _src/app/modules/<module_name>/pages_ by using **ng cli**:

```bash
ng generate component src/app/modules/my_module/pages/my_component-search-page
```

#### 2.6.1. Define your component

The component extends the **AbstractStarkSearchComponent** and pass the type of the data in the extension.
Firstly the main entity, **Movie** in this case, and secondly the search entity, **MovieSearch** still for this case.
This component controller describes the different elements necessary for the Stark Table, as the StarkPaginationConfig and the StarkTableColumnProperties.

Also, this component's controller must call the parent function ngOnInit in the ngOnInit function.

```typescript
import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { STARK_LOGGING_SERVICE, StarkLoggingService } from "@nationalbankbelgium/stark-core";
import { AbstractStarkSearchComponent, StarkPaginationConfig, StarkTableColumnProperties } from "@nationalbankbelgium/stark-ui";
import { Movie, MovieSearchCriteria } from "./entities";
import { MOVIE_SERVICE, MovieService } from "./services";

@Component({
  selector: "movie-search",
  templateUrl: "./movie-search-page.component.html"
})
export class MovieSearchPageComponent extends AbstractStarkSearchComponent<Movie, MovieSearchCriteria> implements OnInit, OnDestroy {
  public columnsProperties: StarkTableColumnProperties[];
  public searchResults: Movie[];
  public paginationConfig: StarkPaginationConfig;

  public constructor(@Inject(STARK_LOGGING_SERVICE) logger: StarkLoggingService, @Inject(MOVIE_SERVICE) demoGenericService: MovieService) {
    super(demoGenericService, logger);

    this.performSearchOnInit = true; // Turn on automatic search (last search criteria)
    this.preserveLatestResults = true; // Keep a reference to the latest results in the latestResults variable
  }

  /**
   * Component lifecycle hook
   */
  public override ngOnInit(): void {
    super.ngOnInit();

    this.results$.subscribe((movies: Movie[]) => (this.searchResults = movies));

    this.columnsProperties = [
      {
        name: "hero",
        label: "Hero",
        isFilterable: true,
        isSortable: true
      },
      {
        name: "title",
        label: "Title",
        isFilterable: true,
        isSortable: true
      },
      {
        name: "year",
        label: "Year",
        isFilterable: true,
        isSortable: true
      }
    ];

    this.paginationConfig = {
      isExtended: false,
      itemsPerPage: 10,
      itemsPerPageOptions: [10, 20, 50],
      itemsPerPageIsPresent: true,
      page: 1,
      pageNavIsPresent: true,
      pageInputIsPresent: true
    };
  }

  /**
   * Component lifecycle hook
   */
  public override ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
```

#### 2.6.2. Define your template

The template contains all information necessary for a page, the title and the stark-generic-search component.
The usage of Generic Search component is explained in the [StarkGenericSearchComponent API documentation](https://stark.nbb.be/api-docs/stark-ui/latest/components/StarkGenericSearchComponent.html).

```html
<h1 class="mat-display-3" translate>Movie Search</h1>
<section class="stark-section">
  <stark-generic-search
    formHtmlId="demo-generic-search-form"
    (searchTriggered)="onSearch($event)"
    (resetTriggered)="onReset($event)"
    [isFormHidden]="false"
    (newTriggered)="onNew($event)"
    (formVisibilityChanged)="onFormVisibilityChange($event)"
  >
    <movies-search-form #searchForm [searchCriteria]="workingCopy" (workingCopyChanged)="updateWorkingCopy($event)"></movies-search-form>
  </stark-generic-search>
  <stark-table
    htmlId="demo-generic-search-table"
    [columnProperties]="columnsProperties"
    [paginationConfig]="paginationConfig"
    [data]="searchResults"
  ></stark-table>
</section>
```
