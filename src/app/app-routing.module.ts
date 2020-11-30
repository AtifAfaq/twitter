import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SideMenuDynamicComponent } from './side-menu-dynamic/side-menu-dynamic.component';
import { RightMenuComponent } from './right-menu/right-menu.component';
import { ProfileComponent } from './profile/profile.component';
import { TweetComponent } from './tweet/tweet.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { SettingsComponent } from './settings/settings.component';
import { LogoutComponent } from './logout/logout.component';
import { SignupComponent } from './signup/signup.component';
import { FrontpageComponent } from './frontpage/frontpage.component';
import { TweetDetailComponent } from './tweet-detail/tweet-detail.component';
import { MessagesComponent } from './messages/messages.component';

const routes: Routes = [
  { path: 'Home', component: HomeComponent },
  { path: 'Profile/:username', component: ProfileComponent },
  { path: 'tweet', component: TweetComponent },
  { path: 'Notifications', component: NotificationsComponent },
  { path: 'Settings', component: SettingsComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'frontpage', component: FrontpageComponent },
  { path: 'tweetDetails/:key', component: TweetDetailComponent },
  { path: 'Messages', component: MessagesComponent },
  { path: '', component: FrontpageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
