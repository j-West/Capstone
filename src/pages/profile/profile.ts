import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { BeerModalPage } from '../beer-modal-page/beer-modal-page';
import { AuthService } from '../../providers/auth-service';
import {LoginPage} from "../login/login";
import { App } from 'ionic-angular';



@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  userBeers: FirebaseListObservable<any>;
  currentUser: any;
  view: string;

  constructor(public navCtrl: NavController, private _app: App, public navParams: NavParams, private _auth: AuthService, af: AngularFire, public modalCtrl: ModalController, public alertCtrl: AlertController) {
    this.userBeers = af.database.list(`/users/${_auth.authState.uid}/beers`);
    this.currentUser = this._auth.authState.auth;
    this.view = 'profile';


  }

  signOut() {
    this._auth.signOut();
    this._app.getRootNav().setRoot(LoginPage);
    console.log('Signed Out')
  }

  showInfo(beer: any) {
    console.log(beer);
    let modal = this.modalCtrl
      .create(BeerModalPage, { beerName: beer.name,
                               beerLogo: beer.logoLarge,
                               beerDesc: beer.description
                             });
    modal.present();
  }

  removeBeer(beerId: string) {
    let confirm = this.alertCtrl.create({
      title: 'Are You Sure?',
      message: 'Was this beer that bad?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          role: 'destructive',
          handler: () => {
            this.userBeers.remove(beerId);
          }
        }
      ]
    });
    confirm.present();
  }

}



