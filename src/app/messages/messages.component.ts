import { Component, OnInit } from '@angular/core';
import { TwitterService } from '../twitter.service';
import { iUser } from '../models/user';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  activeIndex;
  show: boolean = true;
  allUsers: Array<iUser> = [];
  constructor(public service: TwitterService) {
    this.allUsers = this.service.allUsers;
  }

  ngOnInit(): void {
  }
  focusFunction() {
    this.show = false;
  }

  blurFunction() {
    this.show = true;
  }

}
