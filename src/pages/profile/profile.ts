import { Component, Inject } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable, FirebaseApp } from 'angularfire2';
import { BeerModalPage } from '../beer-modal-page/beer-modal-page';
import { AuthService } from '../../providers/auth-service';
import {LoginPage} from "../login/login";
import { App } from 'ionic-angular';
import { Camera, Device } from 'ionic-native';
// import {CountSignature} from "rxjs/operator/count";

declare var window: any;

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  userBeers: FirebaseListObservable<any>;
  firebaseRef: FirebaseListObservable<any>;
  userFbRef: FirebaseObjectObservable<any>;
  profileImgRef: any;
  currentUser: any;
  view: string;
  takenImg: any;


  constructor(public navCtrl: NavController, private _app: App, public navParams: NavParams, @Inject(FirebaseApp) public firebaseApp: any, private _auth: AuthService, af: AngularFire, public modalCtrl: ModalController, public alertCtrl: AlertController) {
    this.userBeers = af.database.list(`/users/${_auth.authState.uid}/beers`);
    this.firebaseRef = af.database.list('users');
    this.userFbRef = af.database.object(`users/${_auth.authState.uid}`);
    this.currentUser = this._auth.authState.auth;
    this.profileImgRef = firebaseApp.storage().ref().child(`images/${_auth.authState.uid}`);
    this.view = 'profile';
  }

  signOut() {
    this._auth.signOut();
    this._app.getRootNav().setRoot(LoginPage);
    console.log('Signed Out')
  }



  showInfo(beer: any) {
    console.log(beer);
    let modal = this.modalCtrl
      .create(BeerModalPage, {
        beerName: beer.name,
        beerLogo: beer.logoLarge,
        beerDesc: beer.description
      });
    modal.present();
  }


  removeBeer(beerId: string) {
    let confirm = this.alertCtrl.create({
      title: 'Are You Sure?',
      message: 'Was this beer that bad?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          role: 'destructive',
          handler: () => {
            this.userBeers.remove(beerId);
          }
        }
      ]
    });
    confirm.present();
  }




  makeFileIntoBlob(_imagePath) {

    // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
    return new Promise((resolve, reject) => {
      window.resolveLocalFileSystemURL(_imagePath, (fileEntry) => {

        fileEntry.file((resFile) => {

          var reader = new FileReader();
          reader.onloadend = (evt: any) => {
            var imgBlob: any = new Blob([evt.target.result], { type: 'image/jpeg' });
            imgBlob.name = 'sample.jpg';
            resolve(imgBlob);
          };

          reader.onerror = (e) => {
            console.log('Failed file read: ' + e.toString());
            reject(e);
          };

          reader.readAsArrayBuffer(resFile);
        });
      });
    });
  }

  uploadToFirebase(_imageBlob) {
    var fileName = this._auth.authState.uid;

    return new Promise((resolve, reject) => {
      var fileRef = this.firebaseApp.storage().ref('images/' + fileName);

      var uploadTask = fileRef.put(_imageBlob);

      uploadTask.on('state_changed', (_snapshot) => {
        console.log('snapshot progess ' + _snapshot);
      }, (_error) => {
        reject(_error);
      }, () => {
        // completion...
        resolve(uploadTask.snapshot);
      });
    });
  }

  saveToDatabaseAssetList(_uploadSnapshot) {
    return new Promise((resolve, reject) => {

      this._auth.authState.auth.updateProfile({
        displayName: this._auth.authState.auth.displayName,
        photoURL: _uploadSnapshot.downloadURL

      })
      // we will save meta data of image in database
      var dataToSave = { 'URL': _uploadSnapshot.downloadURL };

      this.firebaseRef.update(this._auth.authState.uid, dataToSave).then((_response: any) => {
        resolve(_response);
      }).catch((_error) => {
        reject(_error);
      });
    });

  }


  editProfile() {

    // TODO:
    // get picture from camera

    console.log(Device)
    let imageSource = (Device.isVirtual ? Camera.PictureSourceType.PHOTOLIBRARY : Camera.PictureSourceType.CAMERA);

    Camera.getPicture({
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: imageSource,
      targetHeight: 640,
      correctOrientation: true
    }).then((_imagePath) => {
      alert('test got image path ' + _imagePath);
      this.takenImg = _imagePath;
      // convert picture to blob
      return this.makeFileIntoBlob(_imagePath);
    }).then((_imageBlob) => {
      alert('got image blob ' + _imageBlob);

      // upload the blob
      return this.uploadToFirebase(_imageBlob);
    }).then((_uploadSnapshot: any) => {
      alert('file uploaded successfully  ' + _uploadSnapshot.downloadURL);

      // store reference to storage in database
      return this.saveToDatabaseAssetList(_uploadSnapshot);

    }).then((_uploadSnapshot: any) => {
      console.log(this.currentUser);
      alert('file saved to asset catalog successfully  ');
    }, (_error) => {
      alert('myError ' + (_error.message || _error));
    });


  }
}









