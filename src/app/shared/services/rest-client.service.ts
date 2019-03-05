import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestOptions } from '../models/http-request-options.model';

const baseUrl = "https://user.api.it120.cc";

@Injectable({
  providedIn: 'root'
})
export class RestClientService {

  private _xToken: string;
  
  constructor(private _httpClient: HttpClient) { }
  
  set xToken(token: string){
    this._xToken = token;
  }

  public get(url: string, options?: RequestOptions): Observable<any> {
    
    return this._httpClient.get(baseUrl + url, this.mergeOptions(options) as Object);      
  }

  public post(url: string, body: Object, options?: RequestOptions): Observable<Object> {
    return this._httpClient.post(baseUrl + url, body, this.mergeOptions(options) as Object);      
  }

  private mergeOptions(options: RequestOptions){
    let result: RequestOptions;
    result = options ? options : {};    
    if(this._xToken)
      result.headers = (result.headers ? result.headers: new HttpHeaders()).set('X-Token', this._xToken);
  
    return result;
  }
}
