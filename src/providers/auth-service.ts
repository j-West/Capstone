import { Injectable } from '@angular/core';
import { AuthProviders, AngularFireAuth, FirebaseAuthState, AuthMethods } from 'angularfire2';
import { NavController } from 'ionic-angular';

import { LoginPage } from '../pages/login/login';
import {TabsPage} from "../pages/tabs/tabs";
// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';


@Injectable()
export class AuthService {
  public authState: FirebaseAuthState;


  constructor(public auth$: AngularFireAuth) {

    auth$.subscribe((state: FirebaseAuthState) => {
      this.authState = state;
    });
  }

  getAuthenticated(): boolean {
    return this.authState !== null;
  }
  signInWithTwitter(): firebase.Promise<FirebaseAuthState> {
    return this.auth$.login({
      provider: AuthProviders.Twitter,
      method: AuthMethods.Popup
    });
  }

  signOut(): void {
    this.auth$.logout();

  }

  displayName(): string {
    if (this.authState != null) {
      return this.authState.twitter.displayName;
    } else {
      return ;
    }
  }
}
