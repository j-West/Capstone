import { Component, Inject } from '@angular/core';
import {NavController, LoadingController, AlertController, ModalController} from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable, FirebaseApp } from 'angularfire2';
import { Observable } from 'rxjs';
import { Camera, Device } from 'ionic-native';
import { CommentsViewPage } from '../comments-view/comments-view';


declare var window: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  styleUrls: ['/home.scss']
})
export class HomePage {

  allBeers: Observable<any>;
  beers: FirebaseListObservable<any>;
  currentUser: any;
  time: string;
  checkinMessage: string;

  loader: any;
  loader2: any;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public alertCtrl: AlertController, public loadingCtrl: LoadingController, private _auth: AuthService, public af: AngularFire, @Inject(FirebaseApp) public firebaseApp: any) {
    this.allBeers = af.database.list('/beers').map(beers => { return beers.reverse() });
    this.beers = af.database.list('/beers');

    this.currentUser = this._auth.authState.auth;
    this.af.auth.subscribe(auth => console.log(auth));

    this.loader = this.loadingCtrl.create({
      content: 'Please Wait...',
      duration: 10000
    })
    this.loader.present();

    }


  ionViewDidLoad() {
    this.loader.dismiss();
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
    var fileName = this._auth.authState.uid + new Date().getTime() + '.jpg';

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

        let date = new Date();
        this.time = date.toDateString();
        // we will save meta data of image in database
        var dataToSave = {
          'URL': _uploadSnapshot.downloadURL,
          'description': this.checkinMessage,
          'userImg': this.currentUser.photoURL,
          'user': this.currentUser.displayName,
          'when': this.time
        };

        this.beers.push(dataToSave).then((_response: any) => {
          resolve(_response);
        }).catch((_error) => {
          reject(_error);
        });

    });

  }

  addContent() {

    let prompt = this.alertCtrl.create({
      title: 'Checkin',
      message: 'Enter a message to go with your Checkin',
      inputs: [{
        name: 'message',
        placeholder: 'Drink all the Beers'
      }],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            if (data.message === '') {
              this.checkinMessage = 'too drink to type this message'
            } else {
                this.checkinMessage = data.message;
              }
              this.getPhoto();
          }
        }
      ]
    });
    prompt.present()



  }

  getPhoto() {
    // TODO:
    // get picture from camera

    console.log(Device);
    let imageSource = (Device.isVirtual ? Camera.PictureSourceType.PHOTOLIBRARY : Camera.PictureSourceType.CAMERA);

    Camera.getPicture({
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: imageSource,
      targetHeight: 640,
      correctOrientation: true,
      saveToPhotoAlbum: true
    }).then((_imagePath) => {
      // alert('test got image path ' + _imagePath);

      this.loader2 = this.loadingCtrl.create({
        content: 'Please Wait...',
        duration: 10000
      })
      this.loader2.present();

      // convert picture to blob
      return this.makeFileIntoBlob(_imagePath);
    }).then((_imageBlob) => {
      // alert('got image blob ' + _imageBlob);

      // upload the blob
      return this.uploadToFirebase(_imageBlob);
    }).then((_uploadSnapshot: any) => {
      // alert('file uploaded successfully  ' + _uploadSnapshot.downloadURL);

      // store reference to storage in database
      return this.saveToDatabaseAssetList(_uploadSnapshot);

    }).then((_uploadSnapshot: any) => {
      this.loader2.dismiss();

      // alert('file saved to asset catalog successfully  ');
    }
      , (_error) => {
      alert('myError ' + (_error.message || _error));
    });
  }


  viewComments(beer: any) {
    let modal = this.modalCtrl.create(CommentsViewPage, { 'beer' : beer });
    modal.present();
  }



}


