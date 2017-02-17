import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

/*
  Generated class for the CommentsView page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-comments-view',
  templateUrl: 'comments-view.html'
})
export class CommentsViewPage {

  post: any;
  comments: FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public af: AngularFire) {
    this.post = navParams.get('beer');
    this.comments = af.database.list(`beers/${this.post.$key}/comments`)
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }




}
