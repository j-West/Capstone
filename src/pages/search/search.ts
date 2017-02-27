import { Component, Inject } from '@angular/core';
import {NavController, NavParams, ToastController, LoadingController} from 'ionic-angular';
import { BeerService } from '../../providers/beer-service';
import { AngularFire, FirebaseListObservable, FirebaseApp } from 'angularfire2';
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
  time: string;
  loader: any;
  defaultBeer: string;
  searchEither: string

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, @Inject(FirebaseApp) firebaseApp: any, private toastCtrl: ToastController, public navParams: NavParams, private _auth: AuthService, public af: AngularFire, private beerService: BeerService) {
    this.userBeers = af.database.list(`/users/${_auth.authState.uid}/beers`);
    this.allBeer = af.database.list('/beers');
    this.searchInput = '';
    this.searchEither = 'beer';
    this.defaultBeer = firebaseApp.storage().ref().child('images/login-background.png');
  }

  onSearch() {
    this.loader = this.loadingCtrl.create({
      content: 'Please Wait...',
      duration: 5000
    })
    this.loader.present();

  }

  getBeer(beer) {
    if (this.searchEither === 'beer') {
      this.beerService.getBeer(beer).subscribe(res => {
        console.log(res);
        if (res.data) {
          this.loader.dismiss();
          this.beerName = res.data[0].nameDisplay;
          this.beerLogo = res.data[0].labels.large;
          this.currentBeer = res.data;
        } else {
          this.loader.dismiss();
          this.beerName = 'Beer not found';
          this.beerLogo = ''
        }
      })
    } else {
      this.beerService.getBrewery(beer).subscribe(res => {
        console.log(res);
        // if (res.data) {
        //   this.loader.dismiss();
        //   this.beerName = res.data[0].nameDisplay;
        //   this.beerLogo = res.data[0].labels.large;
        //   this.currentBeer = res.data;
        // } else {
        //   this.loader.dismiss();
        //   this.beerName = 'Beer not found';
        //   this.beerLogo = ''
        // }
      })
    }
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
    let toast = this.toastCtrl.create({
      message: `${this.currentBeer[0].nameDisplay} was successfully added!`,
      duration: 1500,
      position: 'bottom'

    });
    toast.present();

  }

}
