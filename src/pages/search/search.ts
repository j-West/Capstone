import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { BeerService } from '../../providers/beer-service';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { AuthService } from '../../providers/auth-service';




@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  userBeers: FirebaseListObservable<any>;
  allBeer: FirebaseListObservable<any>;
  beerName: string;
  beerLogo: string;
  searchInput: string;
  currentBeer: any;
  time: number;

  constructor(public navCtrl: NavController, private toastCtrl: ToastController, public navParams: NavParams, private _auth: AuthService, public af: AngularFire, private beerService: BeerService) {
    this.userBeers = af.database.list(`/users/${_auth.authState.uid}/beers`);
    this.allBeer = af.database.list('/beers');
    this.searchInput = '';

  }

  onSearch() {
    this.getBeer(this.searchInput);
  }

  getBeer(beer) {
    this.beerService.getBeer(beer).subscribe(res => {
      console.log(res);
      if(res.data) {
        this.beerName = res.data[0].nameDisplay;
        this.beerLogo = res.data[0].labels.large;
        this.currentBeer = res.data;
      } else {
        this.beerName = 'Try Again';
        this.beerLogo = '../../assets/images/notFound.jpg'
      }
    })
  }

  saveBeer() {
    this.beerName = '';
    this.beerLogo = '';
    this.searchInput = '';
    this.userBeers.push({
                          name: this.currentBeer[0].nameDisplay,
                          logoLarge: this.currentBeer[0].labels.large,
                          logoSmall: this.currentBeer[0].labels.icon,
                          description: this.currentBeer[0].description
                        });
    this.time = new Date().getTime();
    console.log(this._auth.authState)
    this.allBeer.push({
                        userID: this._auth.authState.uid,
                        name: this.currentBeer[0].nameDisplay,
                        logoLarge: this.currentBeer[0].labels.large,
                        logoSmall: this.currentBeer[0].labels.icon,
                        description: this.currentBeer[0].description,
                        when: this.time
                      })
    let toast = this.toastCtrl.create({
      message: `${this.currentBeer[0].nameDisplay} was successfully added!`,
      duration: 1500,
      position: 'bottom'

    });
    toast.present();
  }

}
