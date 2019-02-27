import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Message {
  MesLocalID: string;
  CreateTime: string;
  Message: string;
  isImageMessage?:boolean;
}

@Component({
  selector: 'app-weixin',
  templateUrl: './weixin.component.html',
  styleUrls: ['./weixin.component.scss']
})
export class WeixinComponent implements OnInit {
  
  public messages: Message[];

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.httpClient.get("./assets/chat.json/")
    .subscribe((products:Message[])=>{
      this.messages = products.sort((a, b)=>{
        return Number.parseInt(b.MesLocalID) - Number.parseInt(a.MesLocalID);
      });
    })
  }

  // isImageMessage(message: Message): boolean {
  //   const result = message.Message.startsWith("<msg><img hdlength");
  //   message.isImageMessage = result;
  //   return result;
  // }

}
