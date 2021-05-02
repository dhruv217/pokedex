import { TestBed } from '@angular/core/testing';

import { PokeapiDataService } from './pokeapi-data.service';

describe('PokeapiDataService', () => {
  let service: PokeapiDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokeapiDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
