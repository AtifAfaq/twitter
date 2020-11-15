import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(public router: Router, public toastr: ToastrService) { }

  ngOnInit(): void {
  }
logOut() {
    var user = firebase.auth().currentUser;
    if (user) {
      firebase.auth().signOut()
        .then(() => {
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
}
