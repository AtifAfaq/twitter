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
  constructor() { this.getAllUsers(); this.fetchAllTweets(); }

  getAllUsers(): void {
    const self = this;
    firebase.database().ref().child('users')
      .once('value', (snapshot) => {
        const data = snapshot.val();
        for (let key in data) {
          let temp = data[key];
          self.allUsers.push(temp);
        }
        // this.publishSomeData(self.allUsers);
      });

  }

  fetchAllTweets(): void {
    const self = this;
    firebase.database().ref().child('tweets').once('value', (snapshot) => {
      var data = snapshot.val();
      for (var key in data) {
        var temp = data[key]
        this.allUsers.filter(user => {
          if (user.uid == temp.uid) {
            temp.user = user;
            self.allTweets.push(temp);
          }
          this.publishSomeData(self.allTweets);
        });
      }
    });

    console.log(this.allTweets);
  }


  publishSomeData(data: any) {
    this.fooSubject.next(data);
  }
  getObservable(): Subject<any> {
    return this.fooSubject;
  }

}
