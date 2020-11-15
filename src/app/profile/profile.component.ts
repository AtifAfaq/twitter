import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  pictureSelected;
  imagePaths: any = [];
  newImage: any = {};
  imageUrl;
  whoToFollow: Array<any> = [
    {
      img: '/assets/icon/Amy.jpeg',
      name: 'Ahmed Raza',
      username: '@raza255'
    },
    {
      img: '/assets/icon/Amy.jpeg',
      name: 'Ahmed Raza',
      username: '@raza255'
    },
    {
      img: '/assets/icon/Amy.jpeg',
      name: 'Ahmed Raza',
      username: '@raza255'
    }
  ];
  constructor() { }

  ngOnInit(): void {
  }

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
    this.pictureSelected = true;
  }

  removeImg(): void {
    this.imageUrl = '';
  }
}
