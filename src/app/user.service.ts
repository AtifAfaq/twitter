import { Injectable } from '@angular/core';
import { iUser } from './models/user';
import { TwitterService } from './twitter.service';
import { iTweet } from './models/tweet';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user = new iUser();
  myTweets: Array<iTweet> = [];

  constructor(public service: TwitterService, public router: Router, public toastr: ToastrService) {
    this.user = JSON.parse(localStorage.getItem('userObj'));
    this.fetchUserTweets();
  }

  fetchUserTweets() {
    const self = this;
    this.user = JSON.parse(localStorage.getItem('userObj'));
    
    // Case for tweets which I have tweeted
    if (this.user) {
      firebase.database().ref().child('tweets').orderByChild('uid').equalTo(this.user.uid)
        .once('value', (snapshot) => {
          var data = snapshot.val();
          for (var key in data) {
            var temp = data[key];
            temp.user = this.user;
            self.myTweets.push(temp);
          }
          self.service.publishSomeData({ onlyMyTweetsFetched: true });
        });
    }

    // Case for tweets which I have retweeted
    if (this.user) {
      firebase.database().ref().child('tweets')
        .once('value', (snapshot) => {
          var data = snapshot.val();
          for (var key in data) {
            var temp = data[key];
            if (temp.isRetweet && temp.isRetweet.includes(this.user.uid)) {
              temp.user = this.user;
              self.myTweets.push(temp);
            }
          }
        })
    }
  }

  logOut() {
    var user = firebase.auth().currentUser;
    if (user) {
      firebase.auth().signOut()
        .then(() => {
          this.emptyUserService();
          this.toastr.success('User Logged Out!');
          localStorage.clear();
          this.router.navigate(['/frontpage']);
          localStorage.setItem('userLoggedIn', 'false');
        })
        .catch((e) => {
          alert(e.message);
        })
    }
    else {
      localStorage.clear();
      localStorage.setItem('userLoggedIn', 'false');
      this.router.navigate(['/frontpage']);
    }
  }

  emptyUserService() {
    this.myTweets = [];
    this.service.allTweets = [];
  }
}