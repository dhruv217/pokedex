import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
} from '@angular/core';
import { skipWhile, tap } from 'rxjs/operators';
import {
  PokeapiDataService,
  PokemonDetails,
} from 'src/app/pokeapi/pokeapi-data.service';

@Component({
  selector: 'app-pokemons',
  templateUrl: './pokemons.component.html',
  styleUrls: ['./pokemons.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonsComponent implements OnInit {
  fetching = true;
  pokemons$ = this.pokeapi.pokemons$.pipe(
    tap((x) => { console.log(x); this.fetching = false }),
    skipWhile((x) => x.length === 0)
  );
  constructor(private pokeapi: PokeapiDataService) {}

  ngOnInit(): void {}

  onNext(event: any) {
    if(!this.fetching)
      if(event.srcElement &&
        event.srcElement.scrollTop >
          (event.srcElement.scrollHeight - event.srcElement.offsetHeight) * 8 / 10) {
            this.fetching = true;
            this.pokeapi.get_next();
          }
  }

  trackPokemon(index: number, pokemon: PokemonDetails): number {
    return pokemon.id;
  }
}
