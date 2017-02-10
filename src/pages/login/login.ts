import { Component } from '@angular/core';
import {Validators, FormBuilder } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { TabsPage } from '../tabs/tabs';
import { ProfilePage } from '../profile/profile';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['/login.scss']
})
export class LoginPage {

  users: FirebaseListObservable<any>;
  currentUser: FirebaseObjectObservable<any>;
  nickname: string;
  email: string;
  password: string;
  userInfo: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private _auth: AuthService, public af: AngularFire, private formBuilder: FormBuilder) {
    this.users = af.database.list('/users');


    this.userInfo = this.formBuilder.group({
      nickname: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }



  logForm() {
    console.log(this.userInfo.value)

  }

  private onSignInSuccess(): void {
    console.log(this._auth);
    this.navCtrl.setRoot(TabsPage);
  }

  signInWithTwitter(): void {
    this._auth.signInWithTwitter()
      .then(() => this.onSignInSuccess());
  }

  signIn(): void {
    this._auth.signIn(this.userInfo.value)
      .then(() => this.onSignInSuccess());
  }

  register(): void {
    this._auth.register(this.userInfo.value)
      .then((data) => {
        this.currentUser = this.af.database.object(`/users/${data.uid}`);
        this.currentUser.set({
          nickname: this.userInfo.value.nickname
        });
        this.onSignInSuccess()
      });

  }

}

