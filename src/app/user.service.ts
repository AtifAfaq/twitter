import { Injectable, NgZone } from '@angular/core';
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
  chatwithUsers: Array<iUser> = [];
  allChats = [];
  allUsers: Array<iUser> = [];
  allMessages = [];
  user = new iUser();
  myTweets: Array<iTweet> = [];
  selectedProfileUsername: string;
  localUser = new iUser();

  constructor(public service: TwitterService, public router: Router, public toastr: ToastrService, public zone: NgZone) {
    this.user = JSON.parse(localStorage.getItem('userObj'));
    this.localUser = JSON.parse(localStorage.getItem('userObj'));


    this.service.getObservable().subscribe((data) => {
      if (data.allUserFetched) {
        this.allUsers = this.service.allUsers;
        this.getChats();
      }
    });
  }


  getChats() {
    const self = this;
    this.allChats = [];
    firebase.database().ref().child('chat')
      .once('value', (snapshot) => {
        var data = snapshot.val();
        for (var key in data) {
          var temp = data[key];
          temp.key = key;
          if (temp.person1 == this.localUser.uid || temp.person2 == this.localUser.uid) {
            if (temp.person1 == this.localUser.uid) {
              var rec = this.allUsers.filter(user => user.uid == temp.person2)
              temp.recipent = rec[0];
            }
            else {
              var rec = this.allUsers.filter(user => user.uid == temp.person1)
              temp.recipent = rec[0];
            }
            self.allChats.push(temp);
          }
        }
        this.sortingTimestampToMoveChat();
        self.service.publishSomeData({ allChats: true });

        console.log('Sorted in service', this.allChats);
      })



  }


  sortingTimestampToMoveChat() {

    this.zone.run(() => {
      this.allChats.sort((a, b) => b.lastChatTimestamp - a.lastChatTimestamp);
      console.log('ChatSorted', this.allChats)
    })
  }


  getByDefaultChat(chat) {
    const self = this;
    self.allMessages = [];
    firebase.database().ref().child(`/chat/${chat.key}/messages`)
      .on('child_added', (snapshot) => {
        var data = snapshot.val();
        data.key = snapshot.key;
        self.allMessages.push(data);
        console.log('Messages', self.allMessages);
      })
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

  tweetsOfSelectedUser(user) {
    this.myTweets = [];
    this.selectedProfileUsername = user.username;
    this.user = user;
    this.myTweets = this.service.allTweets.filter(tweet => (tweet.uid == user.uid || tweet.isRetweet && tweet.isRetweet.includes(user.uid)));
    console.log("sortedMy Array", this.myTweets);
    this.service.publishSomeData({
      tweetsOfSelectedUser: true,
      selectedUser: user
    });
    // if (temp.uid == this.user.uid || temp.isRetweet && temp.isRetweet.includes(this.user.uid)) {
    //   self.myTweets.push(temp);
    // }
  }
}