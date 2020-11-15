import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-extra',
  templateUrl: './extra.component.html',
  styleUrls: ['./extra.component.scss']
})
export class ExtraComponent implements OnInit {
  imagePaths: any = [];
  imageUrls: any = [];
  isDisplay:boolean=false;
  constructor() { }

  ngOnInit(): void {
  }
  openCommenModal(){}
    // SELECT MULTIPLE AND CREATE URLS

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
  OpenTweetModal(){}
  mouseEnter(data : any){
    this.isDisplay= true;
 }

 mouseLeave(data : any){
    this.isDisplay = false;
 }
}
