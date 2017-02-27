import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { AuthService } from '../../providers/auth-service';
import { UserBeerViewPage } from '../user-beer-view/user-beer-view';

@Component({
  selector: 'page-user-modal',
  templateUrl: 'user-modal.html'
})
export class UserModalPage {

  userUid : string;
  userBeers : FirebaseListObservable<any>;
  userNickname : string;
  userPhoto : string;
  currentUser : any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public viewCtrl: ViewController, public af: AngularFire, private _auth: AuthService) {

    this.userUid = navParams.get('userUid');
    this.userNickname = navParams.get('userNickname');
    this.userPhoto = navParams.get('userPhoto');
    this.userBeers = af.database.list(`users/${this.userUid}/beers`);
    this.currentUser = _auth.authState.auth;

  }


  showInfo(beer: any) {
    console.log(beer);
    let modal = this.modalCtrl
      .create(UserBeerViewPage, {
        beerName: beer.name,
        beerLogoLarge: beer.logoLarge,
        beerLogoSmall: beer.logoSmall,
        beerDesc: beer.description
      });
    modal.present();
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }




}




