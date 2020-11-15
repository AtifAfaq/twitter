import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  settings: string;
  constructor() { }

  ngOnInit(): void {
  }
  open(data) {
    this.settings = data;
  }

}
