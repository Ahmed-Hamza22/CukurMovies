import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { environment } from '../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  constructor(private _HttpClient:HttpClient) {}
  movieSelected = signal<string | null>('popular');
  tvSelected = signal<string | null>('popular');
  searchWord:WritableSignal<string> = signal<string>('');
  searchArray:WritableSignal<any[]> = signal<any[]>([]);
  getTrending(time_window:string, entertainmentType:string, page_number:number=1):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}/trending/${entertainmentType}/${time_window}?page=${page_number}&${environment.apiKey}`);
  }
  getEntertainment(entertainmentType:string, list_type:string, page_number:number=1):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}/${entertainmentType}/${list_type}?page=${page_number}&${environment.apiKey}`);
  }
  getSearch(search_type:string,search_word:string, page_number:number=1):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}/search/${search_type}?${environment.apiKey}&query=${search_word}&page=${page_number}`)
  }
  getDiscover(keyword_id:string|number|null, entertainmentType:string|null, page_number:number|null=1):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}/discover/${entertainmentType}?${environment.apiKey}&include_adult=false&language=en-US&include_video=false&page=${page_number}&sort_by=popularity.desc&with_keywords=${keyword_id}`)
  }
}