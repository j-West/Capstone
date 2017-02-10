import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { AngularFireModule, AuthMethods, AuthProviders } from 'angularfire2';
import { MyApp } from './app.component';
import {AuthService} from "../providers/auth-service";
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { ProfilePage } from '../pages/profile/profile';
import { SearchPage } from '../pages/search/search';
import { BeerModalPage } from '../pages/beer-modal-page/beer-modal-page';
import { TabsPage } from '../pages/tabs/tabs';


export const firebaseConfig = {
  apiKey: "AIzaSyDi2Z0CePALh5Z2y5xwkP8qHqSmHM7s1PU",
  authDomain: "beeryou-60d4c.firebaseapp.com",
  databaseURL: "https://beeryou-60d4c.firebaseio.com",
  storageBucket: "beeryou-60d4c.appspot.com",
  messagingSenderId: "439572387432"
};

// const myFirebaseAuthConfig = {
//   provider: AuthProviders.Password,
//   method: AuthMethods.Password
// };


@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    ProfilePage,
    SearchPage,
    BeerModalPage,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    ProfilePage,
    SearchPage,
    BeerModalPage,
    TabsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
