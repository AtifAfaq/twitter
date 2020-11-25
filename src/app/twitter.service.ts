import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { iTweet } from './models/tweet';
import { iUser } from './models/user';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TwitterService {
  public fooSubject = new Subject<any>();
  allUsers: Array<iUser> = [];
  allTweets: Array<iTweet> = [];
  Tweetdetail: iTweet;
  myTweets: Array<iTweet> = [];
  user = new iUser();
  constructor() {
    if (!this.allUsers || !this.allUsers.length) {
      this.getAllUsers();
    }
    this.user = JSON.parse(localStorage.getItem('userObj'));
  }

  getAllUsers(): void {
    const self = this;
    this.allUsers = [];
    firebase.database().ref().child('users')
      .once('value', (snapshot) => {
        const data = snapshot.val();
        for (let key in data) {
          let temp = data[key];
          self.allUsers.push(temp);
        }
        self.publishSomeData({ allUserFetched: true });
        self.fetchAllTweets();
      });
  }

  fetchAllTweets(): void {
    const self = this;
    self.allTweets = [];
    self.myTweets = [];
    firebase.database().ref().child('tweets').once('value', (snapshot) => {
      var data = snapshot.val();
      for (var key in data) {
        var temp: iTweet = data[key]

        // Case for putting users in tweets
        // this.allUsers.filter(user => {
        //   if (user.uid == temp.uid) {
        //     temp.user = user;
        //     self.allTweets.push(temp);
        //   }
        // });

        // Case for putting users in tweets
        var UsersArray: Array<iUser> = this.allUsers.filter(user => user.uid == temp.uid)
        temp.user = UsersArray[0];
        self.allTweets.push(temp);




        //Case for My tweets
        // Tweeted by me 
        if (temp.uid == this.user.uid) {
          // temp.user = this.user;
          self.myTweets.push(temp);
        }

        // Retweeted by me 
        if (temp.isRetweet && temp.isRetweet.includes(this.user.uid)) {
          self.myTweets.push(temp);
        }

      }
      self.publishSomeData({ allTweetsFetched: true });
    });

    console.log('twitterservice', this.allTweets);
    console.log('Mytweets', this.myTweets);
  }


  publishSomeData(data: any): void {
    this.fooSubject.next(data);
  }
  getObservable(): Subject<any> {
    return this.fooSubject;
  }

}
