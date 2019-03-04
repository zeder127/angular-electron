import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _isAuthenticated: boolean = false;

  constructor() { }

  set isAuthenticated(flag: boolean){
    this._isAuthenticated = flag;
  }

  get isAuthenticated(): boolean{
    return this._isAuthenticated;
  }

}
