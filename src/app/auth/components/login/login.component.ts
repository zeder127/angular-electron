import { Component, OnInit } from '@angular/core';
import { RestClientService } from '../../../shared/services/rest-client.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DomSharedStylesHost } from '@angular/platform-browser/src/dom/shared_styles_host';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  protected username: string;
  protected password: string;
  protected randomImgUrl: SafeUrl;
  protected imageCode: string;


  constructor(private _restClient: RestClientService, private _domSanitizer: DomSanitizer) { }

  private _randomNum: string = Math.random() + "";

  ngOnInit() {
    this._restClient.get("/code", { params: new HttpParams().set("k", this._randomNum), responseType: "blob" })
    .subscribe((res)=>{
      if(res){
        const imageUrl = window.URL.createObjectURL(res);
        this.randomImgUrl = this._domSanitizer.bypassSecurityTrustUrl(imageUrl);
      }
        
    });
  }

  public login(){

    let body = new FormData();
    body.set("imgcode", this.imageCode);
    body.set("k", this._randomNum);
    body.set("userName", this.username);
    body.set("pwd", this.password);

    this._restClient.post("/login/userName", body).subscribe((res)=>{
      console.log(res);
    });
  }
}
