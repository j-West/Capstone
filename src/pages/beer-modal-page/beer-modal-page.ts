import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-beer-modal',
  templateUrl: 'beer-modal-page.html'
})
export class BeerModalPage {

  beerName: string;
  beerLogo: string;
  beerDesc: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.beerName = navParams.get('beerName');
    this.beerLogo = navParams.get('beerLogo');
    this.beerDesc = navParams.get('beerDesc');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }


}
