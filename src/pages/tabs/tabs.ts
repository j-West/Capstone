import { Component } from '@angular/core';


import { HomePage } from '../home/home';
import { SearchPage } from '../search/search';
import { ProfilePage } from "../profile/profile";


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  // tab1Root: any = LoginPage;
  tab2Root: any = HomePage;
  tab3Root: any = SearchPage;
  tab4Root: any = ProfilePage;


  constructor() {

  }
}
