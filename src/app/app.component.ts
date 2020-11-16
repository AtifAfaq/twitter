import { Component } from '@angular/core';
import {TwitterService} from './twitter.service';
import {iTweet} from './models/tweet';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'twitter';
  allTweets: Array<iTweet> = [];

  onActivate(event) {
    window.scroll(0, 0);
  }


}

