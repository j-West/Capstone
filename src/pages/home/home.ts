import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { AngularFire } from 'angularfire2';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  styleUrls: ['/home.scss']
})
export class HomePage {

  constructor(public navCtrl: NavController, private _auth: AuthService, public af: AngularFire) {



    this.af.auth.subscribe(auth => console.log(auth));
  }




}

