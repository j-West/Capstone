import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BeerService } from '../../providers/beer-service';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { AuthService } from '../../providers/auth-service';



@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  userBeers: FirebaseListObservable<any>;
  beerName: string;
  beerLogo: string;
  searchInput: string;
  currentBeer: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private _auth: AuthService, af: AngularFire, private beerService: BeerService) {
    this.userBeers = af.database.list(`/users/${_auth.authState.uid}/beers`);
  }

  onSearch() {
    this.getBeer(this.searchInput);
  }

  getBeer(beer) {
    this.beerService.getBeer(beer).subscribe(res => {
      console.log(res);
      if(res.data) {
        this.beerName = res.data[0].nameDisplay;
        this.beerLogo = res.data[0].labels.medium;
        this.currentBeer = res.data;
      } else {
        this.beerName = 'Try Again'
        this.beerLogo = '../../assets/images/notFound.jpg'
      }
    })
  }

  saveBeer() {
    this.userBeers.push({
                          name: this.currentBeer[0].nameDisplay,
                          logo: this.currentBeer[0].labels.large,
                          description: this.currentBeer[0].description
                        })
  }

}
