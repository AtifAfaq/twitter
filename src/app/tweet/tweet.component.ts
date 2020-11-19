import { Component, OnInit, Input } from '@angular/core';
import { TwitterService } from '../twitter.service';
import * as firebase from 'firebase';
import { ToastrService } from 'ngx-toastr';
import { iTweet, iTweetReply } from '../models/tweet';
import { iUser } from '../models/user';


@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.scss']
})
export class TweetComponent implements OnInit {
  @Input() allTweets: Array<iTweet>;
  @Input() allUsers: Array<iUser>;
  newImage: any = {};
  imageUrl: string | ArrayBuffer;
  activeIndex;
  // replyText;
  uploadedString;
  originalTweet: iTweet;
  tweetsLikedByUser = [];
  userData: iUser = JSON.parse(localStorage.getItem('userObj'));
  replies: Array<iTweetReply>;
  replyObj = new iTweetReply();
  user = new iUser();


  icon: Array<any> = [
    {
      icon: 'far fa-trash-alt',
      title: 'Delete'
    },
    {
      icon: 'fas fa-thumbtack',
      title: 'Pin to your profile'
    },
    {
      icon: 'fas fa-pencil-alt',
      title: 'Embed Tweet'
    },
    {
      icon: 'far fa-chart-bar',
      title: 'View Tweet activity'
    },
  ];
  bottomIcon: Array<any> = [
    'far fa-comment-alt',
    'fas fa-retweet',
    'far fa-heart ',
    'far fa-share-square'
  ];

  // document.getElementById('signUpFormCloseButton').click();
  constructor(public service: TwitterService, public toastr: ToastrService) {
    if (!this.user) {
      this.user = new iUser();
    }

  }

  ngOnInit(): void {

  }

  isPostLiked(tweet: iTweet) {
    if (tweet.likes) {
      return tweet.likes.includes(this.userData.uid);
    } else {
      return false;
    }

  }

  unlikedTweet(selectedTweet, i) {
    var tweetKey = selectedTweet.key;
    if (!this.allTweets[i].likes) {
      this.allTweets[i].likes = [];
    }
    selectedTweet.likes.forEach((like, index) => {
      if (like == this.userData.uid) {
        selectedTweet.likes.splice(index, 1);
        // this.allTweets[i].liked = false;
      }
    });
    var updates = {};
    updates['/tweets/' + tweetKey + '/likes'] = selectedTweet.likes;
    firebase.database().ref().update(updates).then(() => {
      this.toastr.success('success', 'unliked!');
    })
      .catch((e) => {
        this.toastr.error('error', e.message);
      });
  }



  likedTweet(selectedTweet, index) {
    var tweetKey = selectedTweet.key;
    if (!this.allTweets[index].likes) {
      this.allTweets[index].likes = [];
    }
    this.allTweets[index].likes.push(this.userData.uid);
    // this.allTweets[index].liked = true;
    console.log('tweets', this.allTweets);
    var updates = {};
    updates['/tweets/' + tweetKey + '/likes'] = this.allTweets[index].likes;
    firebase.database().ref().update(updates).then(() => {
      this.toastr.success('success', 'liked!');

    })
      .catch((e) => {
        this.toastr.error('error', e.message);
      });


    console.log('Alltweets', this.allTweets);

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

  removeImg(): void {
    this.imageUrl = '';
  }

  closeModal() {
    this.replyObj = new iTweetReply();
  }

  confirmOnly(i) {
    this.activeIndex = i;
    console.log(this.activeIndex);
  }

  deleteTweetFromFirebase() {
    var deletedTweetKey;
    deletedTweetKey = this.allTweets[this.activeIndex].key;
    this.allTweets.splice(this.activeIndex, 1);
    console.log(this.allTweets);
    firebase.database().ref().child(`tweets/${deletedTweetKey}`).remove().then(() => {
      this.toastr.success('success', 'Tweet deleted succesfully');
    },
      (e) => {
        this.toastr.error('error', e.message);
      }
    );


  }
  confirmReply(t, i) {
    this.originalTweet = t;
    this.activeIndex = i;
    console.log(this.originalTweet);
  }

  replyTweet(): void {
    if (!this.replyObj.replyText && !this.imageUrl) {
      this.toastr.warning('warning', 'Please add reply or add a picture');
      return;
    }
    if (this.imageUrl) {
      this.uploadImage();
    } else {
      this.postReplyOnFirebase();
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
          // this.tweetData.tweetUrl = downloadURL;
          this.replyObj.replyImage = downloadURL;
          this.postReplyOnFirebase();
        })
          .catch((e) => {
            this.toastr.error('error', e.message);
          });
      });
  }

  postReplyOnFirebase() {
    this.replyObj.uid = this.userData.uid;
    this.replyObj.timestamp = Number(new Date());


    var tweetKey = this.originalTweet.key;
    if (!this.allTweets[this.activeIndex].replies) {
      this.allTweets[this.activeIndex].replies = [];
    }
    this.allTweets[this.activeIndex].replies.push(this.replyObj);
    // this.allTweets[index].liked = true;
    console.log('tweets', this.allTweets);
    var updates = {};
    updates['/tweets/' + tweetKey + `/replies`] = this.allTweets[this.activeIndex].replies;
    firebase.database().ref().update(updates).then(() => {
      this.toastr.success('success', 'replied!');
      this.closeModal();
    })
      .catch((e) => {
        this.toastr.error('error', e.message);
      });
    console.log('Alltweets', this.allTweets);
  }



}
