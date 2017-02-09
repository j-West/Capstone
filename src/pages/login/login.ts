import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { AngularFire } from 'angularfire2';
import { TabsPage } from '../tabs/tabs';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['/login.scss']
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private _auth: AuthService, public af: AngularFire) {}


  private onSignInSuccess(): void {
    console.log(`Facebook display name ${this._auth.displayName()}`);
    this.navCtrl.setRoot(TabsPage);
  }

  signInWithTwitter(): void {
    this._auth.signInWithTwitter()
      .then(() => this.onSignInSuccess());
  }

}

