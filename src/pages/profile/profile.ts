import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { BeerModalPage } from '../beer-modal-page/beer-modal-page';


/*
  Generated class for the Profile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  userBeers: FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, af: AngularFire, public modalCtrl: ModalController, public alertCtrl: AlertController) {
    this.userBeers = af.database.list('/beers');
  }

  showInfo(beer: any) {
    console.log(beer);
    let modal = this.modalCtrl.create(BeerModalPage, {beerName: beer.name,
                                                      beerLogo: beer.logo,
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



