import { Component, OnInit, NgZone } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { iTweet } from '../models/tweet';
import { ToastrService } from 'ngx-toastr';
import { TwitterService } from '../twitter.service';
import { iUser } from '../models/user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  userData = JSON.parse(localStorage.getItem('userObj'));
  allUsers: Array<iUser> = [];
  newImage: any = {};
  imageUrl: string | ArrayBuffer;
  isDisplay = false;
  imageCount: any;
  tweetData = new iTweet();
  allTweets: Array<iTweet> = [];
  myTweets: Array<iTweet> = [];
  activeIndex;



  constructor(public zone: NgZone,
    public router: Router, public toastr: ToastrService,
    public service: TwitterService,
    public userser: UserService) {
  
 
  }


  ngOnInit(): void {

    this.service.getObservable().subscribe((data) => {
      if (data.allTweetsFetched) {
        this.allTweets = this.service.allTweets;
      }
      else if (data.onlyMyTweetsFetched) {
        this.myTweets = this.userser.myTweets;
      }
    });
    this.allTweets = this.service.allTweets;
    this.myTweets = this.userser.myTweets;
    console.log('home Component', this.allTweets);
  }
  openCommenModal(): void { }


  OpenTweetModal(): void {

  }
  // SELECT SINGLE AND CREATE URL
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
  }

  // multiple files 
  // onChangeFile(event: EventTarget) {
  //   let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
  //   let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
  //   let files: FileList = target.files;
  //   for (var a = 0; a < files.length; a++) {
  //     if (files[a].size <= 100000000) {
  //       this.selectedFiles.push(files[a]);
  //     }
  //   }
  // }


  removeImg(): void {
    this.imageUrl = '';

  }

  mouseEnter(data: any): void {
    this.isDisplay = true;
  }

  mouseLeave(data: any): void {
    this.isDisplay = false;
  }


  addTweet(): void {
    if (!this.tweetData.tweetText && !this.imageUrl) {
      this.toastr.warning('warning', 'Please tweet or add a picture');
      return;
    }
    if (this.imageUrl) {
      this.uploadImage();
    } else {
      this.postTweetOnFirebase();
    }
  }

  uploadImage(): void {
    const self = this;
    const storageRef = firebase.storage().ref();
    const filename = Math.floor(Date.now() / 1000) + '.' + self.newImage.name.split('.').pop();
    const uploadTask = storageRef.child('tweetImages/' + filename).put(self.newImage);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => { },
      (error) => {
      }, () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          self.tweetData.tweetUrl = downloadURL;
          self.postTweetOnFirebase();
        })
          .catch((e) => {
            self.toastr.error('error', e.message);
          });
      });
  }

  postTweetOnFirebase(): void {
    const self = this;
    self.tweetData.timestamp = Number(new Date());
    self.tweetData.uid = self.userData.uid;
    self.tweetData.key = firebase.database().ref().child(`/tweets/`).push().key;
    firebase.database().ref().child(`/tweets/${self.tweetData.key}`).
      set(self.tweetData).then(() => {
        self.tweetData.user = self.userData;
        self.service.allTweets.unshift(self.tweetData);
        console.log('tweets', self.allTweets);
        self.toastr.success('success', 'Tweeted Succesfully');
        self.tweetData = new iTweet();
        self.imageUrl = '';
      })
      .catch((e) => {
        self.toastr.error('error', e.message);
      });
  }


}


