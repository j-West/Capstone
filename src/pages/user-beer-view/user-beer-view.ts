import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { AuthService } from '../../providers/auth-service';

/*
  Generated class for the UserBeerView page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-user-beer-view',
  templateUrl: 'user-beer-view.html'
})
export class UserBeerViewPage {

  beerName: string;
  beerLogoLarge: string;
  beerLogoSmall: string;
  beerDesc: string;
  userBeerFbRef : FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public viewCtrl: ViewController, public af: AngularFire, public _auth: AuthService) {

    this.beerName = navParams.get('beerName');
    this.beerLogoLarge = navParams.get('beerLogoLarge');
    this.beerLogoSmall = navParams.get('beerLogoSmall');
    this.beerDesc = navParams.get('beerDesc');
    this.userBeerFbRef = af.database.list(`users/${this._auth.authState.auth.uid}/beers`)


  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  saveBeer() {

    this.userBeerFbRef.push({
      name: this.beerName,
      logoLarge: this.beerLogoLarge,
      logoSmall: this.beerLogoSmall,
      description: this.beerDesc
    });
    let toast = this.toastCtrl.create({
      message: `${this.beerName} was successfully added!`,
      duration: 1500,
      position: 'bottom'

    });
    toast.present();

  }


}
