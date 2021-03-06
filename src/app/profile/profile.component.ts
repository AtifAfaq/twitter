import { Component, OnInit, NgZone } from '@angular/core';
import * as firebase from 'firebase';
import { iUser } from '../models/user';
import { ToastrService } from 'ngx-toastr';
import { TwitterService } from '../twitter.service';
import { iTweet } from '../models/tweet';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  pictureSelected;
  backgroundSelected;
  allTweets: Array<iTweet>;
  myTweets: Array<iTweet>;
  imagePaths: any = [];
  newImage: any = {};
  imageUrl;
  selectedUser = [];
  user = new iUser();
  activeIndex;
  whoToFollow: Array<any> = [
    {
      img: '/assets/icon/Amy.jpeg',
      name: 'Ahmed Raza',
      username: '@raza255'
    },
    {
      img: '/assets/icon/Amy.jpeg',
      name: 'Ahmed Raza',
      username: '@raza255'
    },
    {
      img: '/assets/icon/Amy.jpeg',
      name: 'Ahmed Raza',
      username: '@raza255'
    }
  ];
  constructor(public toastr: ToastrService,
    public service: TwitterService,
    public userser: UserService,
    public route: ActivatedRoute,
    public ngZone: NgZone,
  ) {
    this.myTweets = [];
    var profileUsername = route.snapshot.params.username;

    this.service.getObservable().subscribe(data => {
      if (data.tweetsOfSelectedUser) {
        this.ngZone.run(() => {
          this.myTweets = this.userser.myTweets;
          this.user = data.selectedUser;
        })
      }
      if (data.allTweetsFetched) {
        this.selectedUser = this.service.allUsers.filter(user => user.username == profileUsername)
        this.userser.tweetsOfSelectedUser(this.selectedUser[0]);
      }
      window.scroll(0, 0);
    });

    this.allTweets = this.service.allTweets;
    this.myTweets = this.userser.myTweets;
    if (this.service.allUsers && this.service.allUsers.length) {
      this.user = this.service.allUsers.filter(user => user.username == profileUsername)[0];
    }
    console.log('Tweets from profile page', this.myTweets);
   
  }

  ngOnInit(): void {
  }

  onChangeFile(event: EventTarget): void {
    const eventObj: MSInputMethodContext = <MSInputMethodContext>event;
    const target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    const files: FileList = target.files;
    if (files[0].size <= 100000000) {
      this.newImage = files[0];
    }
    const reader = new FileReader();
    reader.readAsDataURL(this.newImage);
    reader.onload = () => {
      this.imageUrl = reader.result;
    };
    this.pictureSelected = true;
    this.uploadImage();
  }

  updateProfilePic(event: EventTarget): void {
    const eventObj: MSInputMethodContext = <MSInputMethodContext>event;
    const target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    const files: FileList = target.files;
    if (files[0].size <= 100000000) {
      this.newImage = files[0];
    }
    const reader = new FileReader();
    reader.readAsDataURL(this.newImage);
    reader.onload = () => {
      this.imageUrl = reader.result;
    };
    this.pictureSelected = true;
    this.uploadImage();
  }


  uploadImage(): void {
    const self = this;
    const storageRef = firebase.storage().ref();
    const filename = Math.floor(Date.now() / 1000) + '.' + this.newImage.name.split('.').pop();
    const uploadTask = storageRef.child('tweetImages/' + filename).put(this.newImage);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => { },
      (error) => {
      }, () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          this.user.profileUrl = downloadURL;
          this.postReplyOnFirebase();
        })
          .catch((e) => {
            this.toastr.error('error', e.message);
          });
      });
  }
  postReplyOnFirebase() {

    var userUid = this.user.uid;
    var updates = {};
    updates['/users/' + userUid + `/profileUrl`] = this.user.profileUrl;
    firebase.database().ref().update(updates).then(() => {
      localStorage.setItem('userObj', JSON.stringify(this.user));
      this.toastr.success('success', 'Profile picture updated successfully!');
    })
      .catch((e) => {
        this.toastr.error('error', e.message);
      });
    console.log('Alltweets', this.allTweets);
  }

  showBackground() {
    if (this.user.backgroundUrl) {
      return true;
    }
    else {
      return false;
    }
  }

  updateBackground(event: EventTarget): void {
    const eventObj: MSInputMethodContext = <MSInputMethodContext>event;
    const target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    const files: FileList = target.files;
    if (files[0].size <= 100000000) {
      this.newImage = files[0];
    }
    const reader = new FileReader();
    reader.readAsDataURL(this.newImage);
    reader.onload = () => {
      this.imageUrl = reader.result;
    };
    this.backgroundSelected = true;
    this.uploadBackground();
  }

  uploadBackground(): void {
    const self = this;
    const storageRef = firebase.storage().ref();
    const filename = Math.floor(Date.now() / 1000) + '.' + this.newImage.name.split('.').pop();
    const uploadTask = storageRef.child('tweetImages/' + filename).put(this.newImage);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => { },
      (error) => {
      }, () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          this.user.backgroundUrl = downloadURL;
          this.postBackgroundOnFirebase();
        })
          .catch((e) => {
            this.toastr.error('error', e.message);
          });
      });
  }

  postBackgroundOnFirebase() {

    var userUid = this.user.uid;
    var updates = {};
    updates['/users/' + userUid + `/backgroundUrl`] = this.user.backgroundUrl;
    firebase.database().ref().update(updates).then(() => {
      localStorage.setItem('userObj', JSON.stringify(this.user));
      this.toastr.success('success', 'Background updated successfully!');
    })
      .catch((e) => {
        this.toastr.error('error', e.message);
      });
    console.log('Alltweets', this.allTweets);
  }


  removeImg(): void {
    this.imageUrl = '';
  }
}
