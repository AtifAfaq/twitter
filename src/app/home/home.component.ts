import { Component, OnInit, NgZone } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { iTweet } from '../models/tweet';
import { ToastrService } from 'ngx-toastr';
import { TwitterService } from '../twitter.service'
import { iUser } from '../models/user';

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


  constructor(public zone: NgZone,
    public router: Router, public toastr: ToastrService,
    public service: TwitterService) {
    this.service.getObservable().subscribe((data) => {
      this.allTweets = data;
      console.log(data);
    });
  }


  ngOnInit(): void {
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
    const filename = Math.floor(Date.now() / 1000) + '.' + this.newImage.name.split('.').pop();
    const uploadTask = storageRef.child('tweetImages/' + filename).put(this.newImage);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => { },
      (error) => {
      }, () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          this.tweetData.tweetUrl = downloadURL;
          this.postTweetOnFirebase();
        })
          .catch((e) => {
            this.toastr.error('error', e.message);
          });
      });
  }

  postTweetOnFirebase(): void {
    const self = this;
    this.tweetData.timestamp = Number(new Date());
    this.tweetData.uid = this.userData.uid;
    this.tweetData.key = firebase.database().ref().child(`/tweets/`).push().key;
    firebase.database().ref().child(`/tweets/${this.tweetData.key}`).
      set(this.tweetData).then(() => {
        this.toastr.success('success', 'Tweeted Succesfully');
        this.tweetData = new iTweet();
        this.imageUrl = '';
      })
      .catch((e) => {
        alert(e.message);
      });
  }


}


