import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { AuthService } from '../../providers/auth-service';


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
  currentUser: any;
  comment: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private _auth: AuthService, public af: AngularFire) {
    this.currentUser = this._auth.authState.auth;
    this.post = navParams.get('beer');
    this.comments = af.database.list(`beers/${this.post.$key}/comments`)
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  addComment(comment) {
    let newComment = {
      'comment' : comment,
      'user' : this.currentUser.displayName,
      'userImg' : this.currentUser.photoURL
    };

    this.comments.push(newComment);
    this.comment = '';
  }



}
