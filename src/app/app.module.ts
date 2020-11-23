import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import * as firebase from 'firebase';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SideMenuDynamicComponent } from './side-menu-dynamic/side-menu-dynamic.component';
import { RightMenuComponent } from './right-menu/right-menu.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { TweetComponent } from './tweet/tweet.component';
import { ExtraComponent } from './extra/extra.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { SettingsComponent } from './settings/settings.component';
import { LogoutComponent } from './logout/logout.component';
import { SignupComponent } from './signup/signup.component';
import { FormsModule } from '@angular/forms';
import { FrontpageComponent } from './frontpage/frontpage.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule, ToastContainerModule } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { TwitterService } from './twitter.service';
import { UserService } from './user.service';
import { TweetDetailComponent } from './tweet-detail/tweet-detail.component';

// firebaseConfig
var firebaseConfig = {
  apiKey: "AIzaSyBubN6azsVqeVrYpzoAFqIIFeVAGSQONRU",
  authDomain: "twitter-d8380.firebaseapp.com",
  databaseURL: "https://twitter-d8380.firebaseio.com",
  projectId: "twitter-d8380",
  storageBucket: "twitter-d8380.appspot.com",
  messagingSenderId: "585812663778",
  appId: "1:585812663778:web:980f72e487194d48ce2dbb",
  measurementId: "G-2K7R0NK4DY"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    AppComponent,
    SideMenuDynamicComponent,
    RightMenuComponent,
    HomeComponent,
    ProfileComponent,
    TweetComponent,
    ExtraComponent,
    NotificationsComponent,
    SettingsComponent,
    LogoutComponent,
    SignupComponent,
    FrontpageComponent,
    TweetDetailComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgSelectModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    ToastContainerModule,
    ReactiveFormsModule
  ],
  providers: [TwitterService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
