import { Component, OnInit } from '@angular/core';
import { TwitterService } from '../twitter.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  activeIndex;
  show: boolean = true;
  constructor(public service: TwitterService) { }

  ngOnInit(): void {
  }
  focusFunction() {
    this.show = false;
  }

  blurFunction() {
    this.show = true;
  }

}
