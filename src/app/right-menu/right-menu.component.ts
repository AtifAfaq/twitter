import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-right-menu',
  templateUrl: './right-menu.component.html',
  styleUrls: ['./right-menu.component.scss']
})
export class RightMenuComponent implements OnInit {
  show:boolean =true;
  constructor() { }

  ngOnInit(): void {
  }
  focusFunction(){
    this.show=false;
  }

  blurFunction(){
    this.show=true;
  }

}
