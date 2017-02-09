import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';


@Injectable()
export class BeerService {

  http: any;
  baseUrl: string;


  constructor(http: Http) {
    this.http = http;
    this.baseUrl = 'http://api.brewerydb.com/v2/beers?name=';
  }

  getBeer(beerName) {
    return this.http.get(`${this.baseUrl}${beerName}&key=25d68f355a95e5e957f14ca6e969f969`)
      .map(res => res.json());
  }

}
