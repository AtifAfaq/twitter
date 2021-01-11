import { Component, OnInit } from '@angular/core';
import { TwitterService } from '../twitter.service';
import { iUser } from '../models/user';
import * as firebase from 'firebase';
import { UserService } from '../user.service';
import { ToastrService } from 'ngx-toastr';
import { iChat, iMessage } from '../models/tweet';
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  activeIndex;
  message;
  newImage: any = {};
  imageUrl: string | ArrayBuffer;
  show: boolean = true;
  allUsers: Array<iUser> = [];
  chatwithUsers: Array<iUser> = []
  allChats;
  person1;
  person2;
  chatUser: any = {};
  chats = [];
  allMessages = [];
  chat = new iChat();
  constructor(public service: TwitterService, public user: UserService, public toastr: ToastrService) {
    this.allUsers = this.service.allUsers;
    this.chatwithUsers = this.user.chatwithUsers;
    this.allChats = this.user.allChats;
   
    this.service.getObservable().subscribe((data) => {
  
      if (data.allChats) {
        this.allChats = this.user.allChats;
        console.log('allChats', this.allChats)
      }
    });
  }

  ngOnInit(): void {
  }

  focusFunction() {
    this.show = false;
  }

  blurFunction() {
    this.show = true;
  }
  // SELECT SINGLE AND CREATE URL
  onChangeFile(event: EventTarget): void {
    const eventObj: MSInputMethodContext = <MSInputMethodContext>event;
    const target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    const files: FileList = target.files;
    if (files[0].size <= 100000000) {
      this.newImage = files[0];
    }
    const reader = new FileReader();
    reader.readAsDataURL(this.newImage);
    reader.onload = () => {
      this.imageUrl = reader.result;
    };
  }

  startChatWithUser(selectedUser: iUser) {
    const self = this;
    if (selectedUser.uid == self.user.localUser.uid) {
      self.toastr.error('error', 'You cannot chat with yourself')
      document.getElementById('messageCloseButton').click();
      return;
    }
    if (self.chatwithUsers.includes(selectedUser)) {
      self.toastr.error('error', 'Already exists')
      document.getElementById('messageCloseButton').click();
      return;
    }
    else {
      self.chatwithUsers.unshift(selectedUser);
    }
    this.checkUid(selectedUser);
    // this.chatAlreadyCreated();


    document.getElementById('messageCloseButton').click();
  }

  //   chatAlreadyCreated(){
  // firebase.database().ref().child('chat').
  //   }

  checkUid(selectedUser) {
    if (this.user.localUser.uid > selectedUser) {
      this.chat.person1 = this.user.localUser.uid;
      this.chat.person2 = selectedUser.uid;
    }
    else {
      this.chat.person2 = this.user.localUser.uid;
      this.chat.person1 = selectedUser.uid;
    }
  }

  detailsOfChatUser(user) {
    this.chatUser = user;
    console.log('Chat Users', this.chatUser)
    this.showChatOfThisUser(user);
  }

  // Have to work on it 

  showChatOfThisUser(user) {
    this.allMessages = [];
    this.allChats.forEach(chat => {
      if (chat.person1 == user.recipent.uid || chat.person2 == user.recipent.uid) {
        this.person1 = chat.person1;
        this.person2 = chat.person2;
        for (var key in chat.messages) {
          if (key in chat.messages) {
            var temp = chat.messages[key];
            temp.key = key;
            this.allMessages.push(temp);
          }
        }
      }
      console.log('ChatMessages', this.allMessages)
    });
  }

  messageSendOnFirebase(selectedUser) {
    var key = firebase.database().ref().child(`/chat/`).push().key;
    firebase.database().ref().child(`/chat/${key}`).
      set(this.chat).then(() => {
        console.log('Chat', this.chat);
      })
      .catch((e) => {
        self.toastr.error('error', e.message);
      });
    const self = this;
    var converstaion = new iMessage();
    converstaion.text = this.message;
    converstaion.image = '';
    // Not set yet
    converstaion.timestamp = Number(new Date());
    converstaion.uid = self.user.localUser.uid;

    if (converstaion) {
      this.uploadChat(converstaion);
    }


  }

  uploadChat(converstaion) {
    const self = this;
    var selectedChatKey = self.chatUser.key;
    var key = firebase.database().ref().child(`/chat/`).push().key;
    firebase.database().ref().child(`/chat/${selectedChatKey}/messages/${key}`).
      set(converstaion).then(() => {
        console.log('Chat', converstaion);
        this.allMessages.push(converstaion);
        self.toastr.success('success', 'message sent Successfully');
        this.message = '';
      })
      .catch((e) => {
        self.toastr.error('error', e.message);
      });
  }
}
