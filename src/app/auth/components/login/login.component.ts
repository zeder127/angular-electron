import { Component, OnInit } from '@angular/core';
import { RestClientService } from '../../../shared/services/rest-client.service';
import { HttpParams } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ApiFactoryResponse } from '../../../shared/models/api-factory-response.model';
import { UserService } from '../../services/user.service';
import { Router, Route, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  protected username: string = '13816619912';
  protected password: string = 'cdhk2018';
  protected randomImgUrl: SafeUrl;
  protected imageCode: string;
  protected loginErrorMessage: string;
  protected redirectUrl: string;


  constructor(
    private _restClient: RestClientService, 
    private _domSanitizer: DomSanitizer, 
    private _route: ActivatedRoute, 
    private _router: Router,
    private _userService: UserService) { }

  private _randomNum: string = Math.random() + "";

  ngOnInit() {

    // get image code
    this._restClient.get("/code", { params: new HttpParams().set("k", this._randomNum), responseType: "blob" })
    .subscribe((res)=>{
      if(res){
        const imageUrl = window.URL.createObjectURL(res);
        this.randomImgUrl = this._domSanitizer.bypassSecurityTrustUrl(imageUrl);
      }        
    });

    // get redirect Url from queryParams
    this._route.queryParams.subscribe((params:Params)=>{
      this.redirectUrl = params['redirect'] || '/start';
    });
  }

  public login(){

    this.reset();

    let body = new FormData();
    body.set("imgcode", this.imageCode);
    body.set("k", this._randomNum);
    body.set("userName", this.username);
    body.set("pwd", this.password);

    this._restClient.post("/login/userName", body).subscribe((res: ApiFactoryResponse)=>{
      if(res.code===0){
        console.log("Login Sucessfully");
        this._userService.isAuthenticated = true;
        this._router.navigateByUrl(this.redirectUrl);

        //set X-Token
        if(res.data)
          this._restClient.xToken = res.data.toString();
          
      } else {
        this.loginErrorMessage = res.msg; 
      }
        
    });
  }

  private reset(){
    this.loginErrorMessage = null;
  }
}
