import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class DetailsService {
  constructor(private _HttpClient:HttpClient) { }
  getDetails(entertainmentType:string, id:any): Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}/${entertainmentType}/${id}?${environment.apiKey}`);
  }
  getReleaseDateAndCertificate(entertainmentType:string, id:number):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}/${entertainmentType}/${id}/release_dates?${environment.apiKey}`);
  }
  getCredits(entertainmentType:string, id:number):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}/${entertainmentType}/${id}/credits?${environment.apiKey}`);
  }
  getKeywords(entertainmentType:string, id:number):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}/${entertainmentType}/${id}/keywords?${environment.apiKey}`);
  }
  getExternalIds(entertainmentType:string, id:number):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}/${entertainmentType}/${id}/external_ids?${environment.apiKey}`);
  }
  getVideos(entertainmentType:string, id:number):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}/${entertainmentType}/${id}/videos?${environment.apiKey}`); 
  }
  getImages(entertainmentType:string, id:number):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}/${entertainmentType}/${id}/images?${environment.apiKey}`); 
  }
  getRecommendations(entertainmentType:string, id:number):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}/${entertainmentType}/${id}/recommendations?${environment.apiKey}`); 
  }
  getReviews(entertainmentType:string, id:number):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}/${entertainmentType}/${id}/reviews?${environment.apiKey}`); 
  }
  getTVCertificate(entertainmentType:string, id:number):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}/${entertainmentType}/${id}/content_ratings?${environment.apiKey}`); 
  }
  getAggregateCredits(entertainmentType:string, id:number):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}/${entertainmentType}/${id}/aggregate_credits?${environment.apiKey}`);
  }
  getSeasonDetails(entertainmentType:string, id:number, season_number:number):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}/${entertainmentType}/${id}/season/${season_number}?${environment.apiKey}`);
  }
  getSeasonCredits(entertainmentType:string, id:number, season_number:number):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}/${entertainmentType}/${id}/season/${season_number}/credits?${environment.apiKey}`);
  }
  getEpisodeDetails(entertainmentType:string, id:number, season_number:number, episode_number:number):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}/${entertainmentType}/${id}/season/${season_number}/episode/${episode_number}?${environment.apiKey}`);
  }
  getEpisodeCredits(entertainmentType:string, id:number, season_number:number, episode_number:number):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}/${entertainmentType}/${id}/season/${season_number}/episode/${episode_number}/credits?${environment.apiKey}`);
  }
  getEpisodeVideos(entertainmentType:string, id:number, season_number:number, episode_number:number):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}/${entertainmentType}/${id}/season/${season_number}/episode/${episode_number}/videos?${environment.apiKey}`);
  }
  getEpisodeImages(entertainmentType:string, id:number, season_number:number, episode_number:number):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}/${entertainmentType}/${id}/season/${season_number}/episode/${episode_number}/images?${environment.apiKey}`);
  }
  getPersonCredits(entertainmentType:string,id:number):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}/person/${id}/${entertainmentType}_credits?${environment.apiKey}`);
  }
  getVideoChannel(videoId: string):Observable<any> {
    return this._HttpClient.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${environment.youtubeApiKey}`);
  }
}