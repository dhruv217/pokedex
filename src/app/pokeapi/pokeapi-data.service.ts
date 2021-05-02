import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PokeapiDataService {
  private DEFAULT_API_LIMIT = 10;
  private api_url!: string;
  private count = 0;

  pokemons$ = new BehaviorSubject<PokemonDetails[]>([]);

  constructor(
    private http: HttpClient,
    private breakpoints: BreakpointObserver
  ) {
    this.breakpoints
      .observe([
        Breakpoints.Handset,
        Breakpoints.TabletPortrait,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(take(1))
      .subscribe((x) => {
        console.log(x.breakpoints);
        this.DEFAULT_API_LIMIT = this.setLimitFromDisplaySize(x);
        this.api_url = `https://pokeapi.co/api/v2/pokemon?offset=0&limit=${this.DEFAULT_API_LIMIT}`;
        this.get_next();
      });
  }

  private setLimitFromDisplaySize(x: BreakpointState): number {
    console.log(
      x.breakpoints[Breakpoints.Handset],
      x.breakpoints[Breakpoints.TabletPortrait],
      x.breakpoints[Breakpoints.Large],
      x.breakpoints[Breakpoints.XLarge]
    );
    if (x.breakpoints[Breakpoints.XLarge]) return 80;
    if (x.breakpoints[Breakpoints.Large]) return 40;
    if (
      !(
        x.breakpoints[Breakpoints.Handset] ||
        x.breakpoints[Breakpoints.TabletPortrait]
      )
    )
      return 20;
    return 10;
  }

  private get_pokemons() {
    return this.api_url
      ? this.http.get<PokemonApiResponse>(this.api_url).pipe(
          tap((x) => {
            this.api_url = x.next;
            this.count = x.count;
          }),
          switchMap((x) => this.fetchPokemonData(x.results))
        )
      : of([]);
  }

  get_next(): void {
    this.get_pokemons().subscribe((x) =>
      this.pokemons$.next(this.pokemons$.value.concat(x))
    );
  }

  private fetchPokemonData(
    pokemons: PokemonApiResponseResult[]
  ): Observable<PokemonDetails[]> {
    return combineLatest(
      pokemons.map((x) => this.http.get<PokemonDetails>(x.url))
    );
  }
}

export interface Stat2 {
  name: string;
  url: string;
}

export interface Stat {
  base_stat: number;
  effort: number;
  stat: Stat2;
}

export interface Type2 {
  name: string;
  url: string;
}

export interface Type {
  slot: number;
  type: Type2;
}

export interface Other {
  dream_world: Artwork;
  'official-artwork': Artwork;
}

export interface Artwork {
  front_default: string;
  front_female?: any;
}

export interface Sprites {
  front_shiny: string;
  other: Other;
}

export interface PokemonApiResponse {
  count: number;
  next: string;
  previous?: any;
  results: PokemonApiResponseResult[];
}
export interface PokemonApiResponseResult {
  name: string;
  url: string;
}

export interface ParsedPokemonApiResponse {
  id: string;
  name: string;
  url: string;
}

export interface PokemonDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: Sprites;
  stats: Stat[];
  types: Type[];
}
