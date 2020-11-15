import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-side-menu-dynamic',
  templateUrl: './side-menu-dynamic.component.html',
  styleUrls: ['./side-menu-dynamic.component.scss']
})
export class SideMenuDynamicComponent implements OnInit {
  userData;
  imagePaths: any = [];
  imageUrls: any = [];
  tweetText;
  uid;
  activeIndex;
  iconArray: any = [{
    inActiveIcon: '/assets/icon/home.png',
    activeIcon: '/assets/icon/home-active.png',
    title: 'Home'
  },
  {
    inActiveIcon: '/assets/icon/search.png',
    activeIcon: '/assets/icon/search-active.png',
    title: 'Search'
  }
    ,
  {
    inActiveIcon: '/assets/icon/bell.png',
    activeIcon: '/assets/icon/bell-active.png',
    title: 'Notifications'
  },
  {
    inActiveIcon: '/assets/icon/message.png',
    activeIcon: '/assets/icon/message-active.png',
    title: 'Messages'
  }
    ,
  {
    inActiveIcon: '/assets/icon/ribbon.png',
    activeIcon: '/assets/icon/ribbon-active.png',
    title: 'Bookmarks'
  }
    ,
  {
    inActiveIcon: '/assets/icon/person.png',
    activeIcon: '/assets/icon/person-active.png',
    title: 'Profile'
  }
  ];
  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem('userObj'));
    if (!this.userData) {
      this.router.navigate(['/frontpage']);
    }
  }

  active(index) {
    this.activeIndex = index;
    const iconTitle = this.iconArray[this.activeIndex].title;
    this.router.navigate(['/' + iconTitle]);
  }

  onChangeFiles(event: EventTarget) {
    let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
    let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    let files: FileList = target.files;
    for (var i = 0; i < files.length; i++) {
      this.imagePaths[i] = files[i];
      var reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrls.push(e.target.result);
      }
      reader.readAsDataURL(files[i]);
    }
  }

  removeImg(index) {
    this.imageUrls.splice(index, 1);
  }

  tweet() {
    if (this.tweetText === undefined || this.imageUrls.length < 1) {
      alert("Please enter text or add a picture")
      return;
    }
    var tweetData: any = {
      tweetText: this.tweetText,
      uid: localStorage.uid
    }
    this.uid = localStorage.uid;
    var updates = {};
    updates['/tweet/' + this.uid] = tweetData;
    firebase.database().ref().update(updates)
      .then(() => {
        alert("You have tweeted");
        this.router.navigate(['/Home']);
      })
      .catch((e) => {
        alert(e.message);
      })

  }
}


