import { Component, OnInit, NgZone, HostListener, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { TwitterService } from '../twitter.service';
import { iUser } from '../models/user';
import * as firebase from 'firebase';
import { UserService } from '../user.service';
import { ToastrService } from 'ngx-toastr';
import { iChat, iMessage } from '../models/tweet';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, AfterViewChecked {
  getChatofThatUser;
  activeIndex;
  selectedIndex;
  alreadyExists: boolean;
  newImage: any = {};
  imageUrl: string | ArrayBuffer;
  show: boolean = true;
  allUsers: Array<iUser> = [];
  chatwithUsers: Array<iUser> = []
  allChats;
  person1 = JSON.parse(localStorage.getItem('userObj')).uid;
  chatUser: any = {};
  chats = [];
  allMessages = [];
  chat = new iChat();
  latestTimestamp;
  newMessages: any = [];
  counter: number = 0;
  conversation: iMessage = {
    image: '',
    text: '',
    uid: JSON.parse(localStorage.getItem('userObj')).uid,
    timestamp: Number(new Date()),
  }

  @ViewChild('scrollBottom') private scrollBottom: ElementRef;
  constructor(public service: TwitterService, public user: UserService, public toastr: ToastrService, public zone: NgZone) {
    this.allUsers = this.service.allUsers;
    this.allChats = this.user.allChats;
    if (this.allChats.length) {
      this.detailsOfChatUser(this.allChats[0], 0)
    }

    this.service.getObservable().subscribe((data) => {

      if (data.allChats) {
        this.allChats = this.user.allChats;
        this.detailsOfChatUser(this.allChats[0], 0)
        console.log('allChats', this.allChats)
      }
    });
  }

  ngOnInit(): void {

  }

  ngAfterViewChecked() {

  }

  scrollToBottom(): void {
    try {
      this.scrollBottom.nativeElement.scrollTop = this.scrollBottom.nativeElement.scrollHeight;
    } catch (err) { }
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

  removeImg() {
    this.imageUrl = '';
  }

  startChatWithUser(selectedUser: iUser) {
    const self = this;
    if (selectedUser.uid == self.user.localUser.uid) {
      self.toastr.error('error', 'You cannot chat with yourself')
      document.getElementById('messageCloseButton').click();
      return;
    }

    if (selectedUser.uid !== self.user.localUser.uid) {
      self.allChats.forEach(chat => {
        if (chat.recipent.uid == selectedUser.uid) {
          self.toastr.error('error', 'Already exists')
          document.getElementById('messageCloseButton').click();
          this.alreadyExists = true;
        }
      });
    }

    if (!this.alreadyExists) {
      this.checkUid(selectedUser);
    }
    document.getElementById('messageCloseButton').click();
  }


  checkUid(selectedUser) {
    if (this.user.localUser.uid > selectedUser) {
      this.chat.person1 = this.user.localUser.uid;
      this.chat.person2 = selectedUser.uid;
    }
    else {
      this.chat.person2 = this.user.localUser.uid;
      this.chat.person1 = selectedUser.uid;
    }

    var obj: any = {};
    obj.key = firebase.database().ref().child(`/chat/`).push().key;
    obj.recipent = selectedUser;
    obj.person1 = this.chat.person1;
    obj.person2 = this.chat.person2;
    this.allChats.push(obj);
    console.log(this.allChats)
  }

  detailsOfChatUser(user, i) {
    debugger;
    this.chatUser = user;
    this.selectedIndex = i;
    this.getChatFromFirebase(user, i);
  }

  decrement(chatUser, index) {
    this.zone.run(() => {
      var selectedChatKey = this.chatUser.key;
      this.counter = 0;
      firebase.database().ref().child(`/chat/${selectedChatKey}/${this.person1}`).
        set(this.counter).then(() => {
          this.allChats[index][this.person1] = this.counter;
        })
    })
  }

  getChatFromFirebase(user, i) {
    const self = this;
    self.allMessages = [];
    firebase.database().ref().child(`/chat/${user.key}/messages`)
      .on('child_added', (snapshot) => {
        this.zone.run(() => {
          var data = snapshot.val();
          data.key = snapshot.key;
          self.allMessages.push(data);
          self.user.allChats[i].messages = self.allMessages
          setTimeout(() => {
            this.scrollToBottom();
          }, 2000);
        })
        this.sortingTimestampToMoveChatQ();
      })
  }

  messageSendOnFirebase(selectedUser) {
    debugger;
    this.getChatofThatUser = selectedUser;
    if (!selectedUser.messages) {
      firebase.database().ref().child(`/chat/${selectedUser.key}`).
        set(this.chat).then(() => {
          console.log('Chat', this.chat);
        })
        .catch((e) => {
          self.toastr.error('error', e.message);
        });
    }
    const self = this;

    if (this.imageUrl) {
      this.uploadImage()
    }
    else {
      this.uploadChat()
    }
  }

  uploadImage(): void {
    const self = this;
    const storageRef = firebase.storage().ref();
    const filename = Math.floor(Date.now() / 1000) + '.' + self.newImage.name.split('.').pop();
    const uploadTask = storageRef.child('chatImages/' + filename).put(self.newImage);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => { },
      (error) => {
      }, () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          this.conversation.image = downloadURL;
          this.uploadChat();
        })
          .catch((e) => {
            self.toastr.error('error', e.message);
          });
      });
  }

  uploadChat() {
    const self = this;

    if (self.conversation.text || self.conversation.image) {
      var selectedChatKey = self.chatUser.key;
      self.conversation.uid = JSON.parse(localStorage.getItem('userObj')).uid;
      self.conversation.timestamp = Number(new Date()),
        firebase.database().ref().child(`/chat/${selectedChatKey}/messages/`).
          push(self.conversation).then(() => {
            self.toastr.success('success', 'message sent Successfully');
            self.imageUrl = '';
            self.latestTimestamp = self.conversation.timestamp;

          })
          .catch((e) => {
            self.toastr.error('error', e.message);
          });
      self.uploadLatestTimestamp(selectedChatKey);
    }
    else {
      self.toastr.error('error', 'Please send a message or pic');
    }

  }


  uploadLatestTimestamp(selectedChatKey) {
    firebase.database().ref().child(`/chat/${selectedChatKey}/lastChatTimestamp`).
      set(this.conversation.timestamp).then(() => {
        this.allChats[this.selectedIndex].lastChatTimestamp = this.conversation.timestamp;
        this.getUnreadMessage(selectedChatKey)

      })
  }
  getUnreadMessage(selectedChatKey) {
    firebase.database().ref().child(`/chat/${selectedChatKey}/${this.getChatofThatUser.recipent.uid}`).
      once('value', (snapshot) => {
        this.counter = snapshot.val();
        this.uploadUnreadMessage(selectedChatKey);
      })

  }

  uploadUnreadMessage(selectedChatKey) {
    this.increment();
    firebase.database().ref().child(`/chat/${selectedChatKey}/${this.getChatofThatUser.recipent.uid}`).
      set(this.counter).then(() => {
        this.allChats[this.selectedIndex][this.getChatofThatUser.recipent.uid] = this.counter;
        this.getChatFromFirebase(this.getChatofThatUser, this.selectedIndex);

      })

  }


  sortingTimestampToMoveChatQ() {
    this.allChats.sort((a, b) => b.lastChatTimestamp - a.lastChatTimestamp);
    this.conversation.text = '';
    this.conversation.image = '';
    this.getUnreadMessageCount();
  }

  public isEmojiPickerVisible: boolean;
  public addEmoji(event) {
    this.conversation.text = `${this.conversation.text}${event.emoji.native}`;
    this.isEmojiPickerVisible = false;
  }

  onActivate(event) {
    window.scrollTo(0, document.body.scrollHeight);
  }

  increment() {
    this.counter += 1;
  }


  getUnreadMessageCount() {
    var selectedChatKey = this.chatUser.key;
    firebase.database().ref().child(`/chat/${selectedChatKey}/${this.chatUser.recipent.uid}`).
      once('value', (snapshot) => {
        this.counter = snapshot.val();
      })

  }

  getUnreadCount(chat) {
    return chat[this.person1];
  }


}







