import { Injectable } from '@angular/core';
import { iUser } from './models/user';
import { TwitterService } from './twitter.service';
import { iTweet } from './models/tweet';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user = new iUser();
  myTweets: Array<iTweet> = [];

  constructor(public service: TwitterService) {
    this.user = JSON.parse(localStorage.getItem('userObj'));
    // this.allTweets = this.service.allTweets;
    // console.log('userService', this.allTweets);
    this.fetchUserTweets();
  }

  fetchUserTweets() {
    const self = this;
    firebase.database().ref().child('tweets').once('value', (snapshot) => {
      var data = snapshot.val();
      for (var key in data) {
        var temp = data[key];
        if (this.user.uid == temp.uid) {
          temp.user = this.user;
          self.myTweets.push(temp);
        }
      }
    });
  }

}