import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from "@angular/router";
import * as firebase from 'firebase';
import { NgSelectModule, NgOption } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TwitterService } from '../twitter.service'
import { iUser } from '../models/user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-frontpage',
  templateUrl: './frontpage.component.html',
  styleUrls: ['./frontpage.component.scss']
})

export class FrontpageComponent implements OnInit {
  allUsers: any = [];
  email;
  password;
  signUp = new FormGroup({
    name: new FormControl(''),
    phone: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
  });
  uid;
  UserFormData: any;
  Usephone: boolean;
  selectedMonth: any;
  selectedDay: any;
  selectedYear: any;
  year: any = [];
  months: any = [{
    name: 'January',
    value: 0
  },
  {
    name: 'February',
    value: 1
  },
  {
    name: 'March',
    value: 2
  },
  {
    name: 'April',
    value: 3
  },
  {
    name: 'May',
    value: 4
  },
  {
    name: 'June',
    value: 5
  },
  {
    name: 'July',
    value: 6
  },
  {
    name: 'August',
    value: 7
  },
  {
    name: 'September',
    value: 8
  },
  {
    name: 'October',
    value: 9
  },
  {
    name: 'November',
    value: 10
  },
  {
    name: 'December',
    value: 11
  }];
  // days Array
  days: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

  constructor(public router: Router, public el: ElementRef,
    public toastr: ToastrService, public fb: FormBuilder, public service: TwitterService, public userser: UserService) {

  }

  ngOnInit(): void {
    this.yearsGeneration();
    this.signUp = this.fb.group({
      name: ['', Validators.compose([
        Validators.required
      ])],
      phone: ['', Validators.compose([
        Validators.required
      ])],
      email: ['', Validators.compose([
        // Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'),
        Validators.required
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ])],
      selectedMonth: ['', Validators.compose([
        Validators.required
      ])],
      selectedDay: ['', Validators.compose([
        Validators.required
      ])],
      selectedYear: ['', Validators.compose([
        Validators.required
      ])],
    });
  }

  yearsGeneration() {
    const now = new Date().getUTCFullYear();
    this.year = Array(now - (now - 120)).fill('').map((v, idx) => now - idx) as Array<number>;
  }

  signup() {
    this.UserFormData = this.signUp.value;
    console.log(this.UserFormData);
    firebase.auth().createUserWithEmailAndPassword(this.UserFormData.email, this.UserFormData.password)
      .then((user) => {
        this.uid = firebase.auth().currentUser.uid;
        this.saveDataFirebase();
      })
      .catch((e) => {
        this.toastr.error('error', e.message);
      })
  }

  saveDataFirebase() {

    var userData: iUser = {
      name: this.UserFormData.name,
      phone: this.UserFormData.phone,
      email: this.UserFormData.email,
      username: this.generateUsername(),
      uid: this.uid,
      dateOfBirth: Number(new Date(this.selectedYear, this.selectedMonth, this.selectedDay)),
      timestamp: Number(new Date())
    };
    var updates = {};
    updates['/users/' + this.uid] = userData;
    firebase.database().ref().update(updates)
      .then(() => {
        this.toastr.success('success', 'Your account has been successfully created!');
        localStorage.setItem('userObj', JSON.stringify(userData));
        localStorage.setItem('userLoggedIn', 'true');
        firebase.auth().currentUser.sendEmailVerification();
        document.getElementById('signUpFormCloseButton').click();
        this.service.getAllUsers();
        this.router.navigate(['/Home']);
      })
      .catch((e) => {
        this.toastr.error('error', 'e.message');
      });
  }

  login(): void {
    firebase.auth().signInWithEmailAndPassword(this.email, this.password)
      .then((user) => {
        if (user) {
          this.uid = firebase.auth().currentUser.uid;
          // if (firebase.auth().currentUser.emailVerified) {
          this.getUserData();
          // }
          // else {
          //   alert("Your account is not verified! Go to your email address and verify");
          //   firebase.auth().currentUser.sendEmailVerification();
          // }
        }
      })
      .catch((e) => {
        this.toastr.error('error', e.message);
      });
  }

  getUserData() {
    firebase.database().ref().child('users/' + this.uid)
      .once('value', (snapshot) => {
        var user = snapshot.val();
        this.toastr.success('success', 'You are successfully logged in!');
        localStorage.setItem('userObj', JSON.stringify(user));
        localStorage.setItem('userLoggedIn', 'true');
        this.userser.localUser = user;
        this.userser.user = user;
        this.service.getAllUsers();
        // this.userser.fetchUserTweets();
        this.router.navigate(['/Home']);
      })
      .catch((e) => {
        this.toastr.error('error', e.message);
      });
  }

  generateUsername() {
    var randomNumber = Math.floor(100000 + Math.random() * 900000);
    var userName = this.UserFormData.name;
    var res = userName.concat(randomNumber);
    this.validateUsername(res);
    return res;
  }
  validateUsername(res) {
    this.allUsers = this.service.allUsers;
    this.allUsers.forEach(user => {
      if (user.username == res) {
        this.generateUsername();
      }
    });

  }
}

