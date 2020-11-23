import { Component, OnInit } from '@angular/core';
import { TwitterService } from '../twitter.service';
import { iTweet, iTweetReply } from '../models/tweet';
import * as firebase from 'firebase';
import { UserService } from '../user.service';
import { ToastrService } from 'ngx-toastr';
import { iUser } from '../models/user';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tweet-detail',
  templateUrl: './tweet-detail.component.html',
  styleUrls: ['./tweet-detail.component.scss']
})
export class TweetDetailComponent implements OnInit {
  Tweet: iTweet;
  allTweets: Array<iTweet> = [];
  allUsers: Array<iUser> = [];
  userData;
  tweetKeyReciever: string;

  constructor(public service: TwitterService, public userser: UserService, public toastr: ToastrService,
    public router: Router, private route: ActivatedRoute) {
    this.tweetKeyReciever = route.snapshot.params.key;


    this.service.allTweets.forEach(twet => {
      if (twet.key == this.tweetKeyReciever) {
        this.Tweet = twet;
      }
    })
    // this.Tweet = this.service.Tweetdetail;
    this.allTweets.push(this.Tweet);
    if (!this.Tweet) {
      this.router.navigate(['/Home']);
    }

    console.log("Tweet Details", this.allTweets);
    this.allUsers = this.service.allUsers;
    this.userData = this.userser.user;
    this.sortingUserReply();
  }

  ngOnInit(): void {

  }
  sortingUserReply() {
    if (this.allTweets[0].replies) {
      this.allTweets[0].replies.forEach((reply, index) => {
        this.allUsers.forEach(user => {
          if (reply.uid == user.uid) {
            this.allTweets[0].replies[index].user = user;
          }
        });
      });
      console.log('Reply with user', this.allTweets);
    }
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



  isReplyLiked(reply: iTweetReply) {
    if (reply.likes) {
      return reply.likes.includes(this.userData.uid);
    } else {
      return false;
    }

  }

  unlikedReply(selectedReply, index) {
    var replyKey = selectedReply.key;
    var tweetKey = this.Tweet.key;
    if (!this.allTweets[0].replies[index].likes) {
      this.allTweets[0].replies[index].likes = [];
    }

    var removeIndex = selectedReply.likes.indexOf(this.userData.uid);
    selectedReply.likes.splice(removeIndex, 1);

    var updates = {};
    updates['/tweets/' + tweetKey + '/replies/' + index + '/likes'] = this.allTweets[0].replies[index].likes;
    firebase.database().ref().update(updates).then(() => {
      this.toastr.success('success', 'unliked!');
    })
      .catch((e) => {
        this.toastr.error('error', e.message);
      });
  }



  likedReply(selectedReply, index) {
    var tweetKey = this.Tweet.key;
    var replyKey = selectedReply.key;
    if (!this.allTweets[0].replies[index].likes) {
      this.allTweets[0].replies[index].likes = [];
    }
    this.allTweets[0].replies[index].likes.push(this.userData.uid);
    // this.allTweets[index].liked = true;
    console.log('likes Array added', this.allTweets);
    var updates = {};
    updates['/tweets/' + tweetKey + '/replies/' + index + '/likes'] = this.allTweets[0].replies[index].likes;
    firebase.database().ref().update(updates).then(() => {
      this.toastr.success('success', 'liked Reply!');

    })
      .catch((e) => {
        this.toastr.error('error', e.message);
      });
  }

  confirmReply(r, i) {

  }

}
