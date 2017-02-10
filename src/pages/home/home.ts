import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable,  } from 'angularfire2';
import { Observable } from 'rxjs';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  styleUrls: ['/home.scss']
})
export class HomePage {

  allBeers: Observable<any>;

  constructor(public navCtrl: NavController, private _auth: AuthService, public af: AngularFire) {
    this.allBeers = af.database.list('/beers', {
      query: { orderByChild: 'when' }
    }).map(beers => { return beers.reverse() });



    this.af.auth.subscribe(auth => console.log(auth));
  }




}

