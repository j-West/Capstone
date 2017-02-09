import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { BeerService } from '../providers/beer-service';
import { AuthService } from '../providers/auth-service';


import { LoginPage } from '../pages/login/login';


@Component({
  templateUrl: 'app.html',
  providers: [BeerService, AuthService]
})
export class MyApp {
  rootPage = LoginPage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }



}
