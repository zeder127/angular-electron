import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestOptions } from '../models/http-request-options.model';

const baseUrl = "https://user.api.it120.cc";

@Injectable({
  providedIn: 'root'
})
export class RestClientService {

  constructor(private _httpClient: HttpClient) { }

  public get(url: string, options?: RequestOptions): Observable<any> {
    return this._httpClient.get(baseUrl + url, options as Object);      
  }

  public post(url: string, body: Object, options?: RequestOptions): Observable<Object> {
    return this._httpClient.post(baseUrl + url, body, options as Object);      
  }
}
