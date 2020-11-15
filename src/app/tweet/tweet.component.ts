import { Component, OnInit, Input } from '@angular/core';
import { TwitterService } from '../twitter.service';
import * as firebase from 'firebase';
import { ToastrService } from 'ngx-toastr';
import { iTweet } from '../models/tweet';
import { iUser } from '../models/user';


@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.scss']
})
export class TweetComponent implements OnInit {
  @Input() allTweets: Array<iTweet>;
  @Input() allUsers: Array<iUser>;
    tweetsLikedByUser = [];
  userData: iUser = JSON.parse(localStorage.getItem('userObj'));

  // tweet: Array<any> = [
  //   {
  //     profileImage: '/assets/icon/tweetProfile.jpg',
  //     name: 'Muhammad Afaq',
  //     username: '@Muhammad15067',
  //     date: 'Sep 23',
  //     quote: 'Do you remember when you joined Twitter? I do!#MyTwitterAnniversary',
  //   },
  //   {
  //     retweet: 'Junaid Iqbal',
  //     profileImage: '/assets/icon/tweetProfile.jpg',
  //     name: 'Muhammad Afaq',
  //     username: '@Muhammad15067',
  //     date: 'Sep 23',
  //     quote: 'Do you remember when you joined Twitter? I do!#MyTwitterAnniversary',
  //   },
  //   {
  //     profileImage: '/assets/icon/tweetProfile.jpg',
  //     name: 'Muhammad Afaq',
  //     username: '@Muhammad15067',
  //     date: 'Sep 23',
  //     quote: 'Do you remember when you joined Twitter? I do!#MyTwitterAnniversary',
  //     tweetImage: '/assets/icon/5.jpeg',
  //   },
  //   {
  //     profileImage: '/assets/icon/tweetProfile.jpg',
  //     name: 'Muhammad Afaq',
  //     username: '@Muhammad15067',
  //     date: 'Sep 23',
  //     quote: 'Do you remember when you joined Twitter? I do!#MyTwitterAnniversary',
  //     retweeted: 'yes'
  //   }

  // ];
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
  constructor(public service: TwitterService, public toastr: ToastrService) {
    // this.allTweets = this.service.allTweets;
    // this.allUsers = this.service.allUsers;
  
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



}
