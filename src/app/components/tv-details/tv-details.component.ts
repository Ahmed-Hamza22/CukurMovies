import { DatePipe, isPlatformBrowser, NgClass, NgStyle, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../core/environment/environment';
import { ITVCast, ITVCrew, Role } from '../../core/interfaces/icrew';
import { IMedia } from '../../core/interfaces/imedia';
import { ITVDetails, Season } from '../../core/interfaces/itvdetails';
import { DetailsService } from '../../core/services/details.service';
import { TimePipe } from '../../core/pipes/time.pipe';
import { RatingPipe } from '../../core/pipes/rating.pipe';
import { ProgressPipe } from '../../core/pipes/progress.pipe';
import { ITVLinks } from '../../core/interfaces/itvlinks';
import { Productioncompany } from '../../core/interfaces/imoviedetails';
import { IReview } from '../../core/interfaces/ireview';
import { TermPipe } from '../../core/pipes/term.pipe';
import { IImage } from '../../core/interfaces/iimage';
import { ISeries } from './../../core/interfaces/imedia';
import { MoviesService } from '../../core/services/movies.service';

@Component({
  selector: 'app-tv-details',
  standalone: true,
  imports: [NgStyle,NgClass,DatePipe,TimePipe,RatingPipe,ProgressPipe,RouterLink,UpperCasePipe,TitleCasePipe,TermPipe],
templateUrl: './tv-details.component.html',
  styleUrl: './tv-details.component.scss'
})
export class TvDetailsComponent implements OnInit, OnDestroy {
  private readonly _TitleService = inject(Title);
  private readonly _MoviesService = inject(MoviesService);
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _DetailsService = inject(DetailsService);
  private readonly _PLATFORM_ID = inject(PLATFORM_ID);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly renderer = inject(Renderer2);
  mediaId:any;
  imgPrefix:string = environment.imgPath;
  posterPrefix:string = environment.detailsBackground;
  imgView:string = environment.imgOriginalSize;
  certificate:BehaviorSubject<string | any> = new BehaviorSubject('');
  TVCertificate!:string | null;
  TVCountry!:string | null;
  TVGenres:string[] | null = [];
  TVSeasons:Season[] = [];
  lastSeason:Season = {} as Season;
  isTrailerVisible: boolean = false;
  private clickListener: (() => void) | null = null;
  TVTrailerVideo:IMedia | any ;
  crew:ITVCrew[] = [];
  cast:ITVCast[] = [];
  TVPCompanies:Productioncompany[] = [];
  TVVideos:IMedia[] = [];
  TVReversedVideos:IMedia[] = [];
  modifiedURLs:string [] = [];
  TVExternalIds:ITVLinks | any;
  TVKeywords: { id:number , name: string }[] | null = [];
  TVReviews:IReview[] = [];
  TVOneReviews:IReview = {} as IReview;
  mediaActiveTab: string = 'videos';
  TVImages:IImage | any;
  isVideoVisible:boolean = false;
  videoBackgroundUrls: string[] = [];
  currentVideoIndex: number | null = null;
  TVRecommendations:ISeries[] = [];
  TVDetails!:ITVDetails;
  ngOnInit(): void {
    this._MoviesService.searchWord.set('');
    this._MoviesService.searchArray.set([]);
    this._ActivatedRoute.paramMap.subscribe({
      next:(params)=>{
        this.mediaId = params.get('id');
        this._DetailsService.getDetails('tv',this.mediaId).subscribe({
          next:(res)=>{
            this.TVDetails = res;
            this._TitleService.setTitle(this.TVDetails.name + ' - ÇukurWatch');
            this.TVGenres = res.genres.map((genre:any) => genre.name);
            this.TVPCompanies = res.production_companies.sort((a:Productioncompany, b:Productioncompany) => {
              if (a.logo_path === null) return 1;
              if (b.logo_path === null) return -1;
              return 0;
          });
            this.TVCountry = res.origin_country[0];
            this.TVSeasons = res.seasons;
            this.lastSeason = this.TVSeasons[this.TVSeasons.length-1];
          }
        });
        this._DetailsService.getTVCertificate('tv',this.mediaId).subscribe({
          next:(res)=>{
            if(res.results.find((country:any)=>country.iso_3166_1 === this.TVCountry)?.rating){
              this.certificate.next(res.results.find((country:any)=>country.iso_3166_1 === this.TVCountry)?.rating);
            }else if(res.results.find((country:any)=>country.iso_3166_1 === "US")?.rating){
              this.certificate.next(res.results.find((country:any)=>country.iso_3166_1 === "US")?.rating);
            }else{
              this.certificate.next('NR');
            }
            this.certificate.subscribe({
              next:(data)=>{
                this.TVCertificate = data;
              }
            });
          }
        });
        this._DetailsService.getAggregateCredits('tv',this.mediaId).subscribe({
          next:(res)=>{
            this.crew = res.crew;
            this.cast = res.cast;
          }
        });
        this._DetailsService.getKeywords('tv',this.mediaId).subscribe({
          next:(res)=>{
            this.TVKeywords = res.results;
          }
        });
        this._DetailsService.getExternalIds('tv',this.mediaId).subscribe({
          next:(res)=>{
            this.TVExternalIds = res;
          }
        });
        this._DetailsService.getVideos('tv',this.mediaId).subscribe({
          next:(res)=>{
            this.TVVideos = res.results;
            this.TVReversedVideos = [...this.TVVideos].reverse().slice(0, 6);
            this.TVReversedVideos.forEach((vid:any, index) => {
              const baseUrl = 'https://i.ytimg.com/vi/' + vid?.key;
              const imageUrl720 = baseUrl + '/hq720.jpg';
              const imageUrlDefault = baseUrl + '/hqdefault.jpg';
              if (isPlatformBrowser(this._PLATFORM_ID)) {
                const img = new Image();
                img.src = imageUrl720;
                img.onload = () => {
                  if (img.naturalWidth === 120 && img.naturalHeight === 90) { 
                    this.videoBackgroundUrls[index] = `url(${imageUrlDefault})`;
                  } else {
                    this.videoBackgroundUrls[index] = `url(${imageUrl720})`;
                  }
                };
                img.onerror = () => {
                  this.videoBackgroundUrls[index] = `url(${imageUrlDefault})`;
                };
              }
            });
            let modifiedUrl:any;
            for (let i = 0; i < this.TVVideos.length; i++) {
              modifiedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.TVVideos[i].key}?autoplay=1`);
              this.modifiedURLs.unshift(modifiedUrl);
            }
            this.TVTrailerVideo = res.results.find((i:any)=>i.name === "Final Trailer");
            if(this.TVTrailerVideo == null){
              this.TVTrailerVideo = res.results.find((i:any)=>i.name === "Official Trailer");
            }
            if(this.TVTrailerVideo == null){
              this.TVTrailerVideo = res.results.find((i:any)=>i.type === "Trailer");
            }
            if(this.TVTrailerVideo == null){
              this.TVTrailerVideo = res.results[0];
            }
            this.TVTrailerVideo = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.TVTrailerVideo?.key}?autoplay=0`);
          }
        });
        this._DetailsService.getReviews('tv',this.mediaId).subscribe({
          next:(res)=>{
            Array.prototype.sample = function () {
              return this[Math.floor(Math.random() * this.length)];
            };
            this.TVReviews = res.results;
            this.TVOneReviews = this.TVReviews.sample();
          }
        });
        this._DetailsService.getImages('tv',this.mediaId).subscribe({
          next:(res)=>{
            this.TVImages = res;
          }
        });
        this._DetailsService.getRecommendations('tv',this.mediaId).subscribe({
          next:(res)=>{
            this.TVRecommendations = res.results;
          }
        });
      }
    });
  }
  getTotalEpisodes(actorRoles: Role[]): number {
    return actorRoles.reduce((total:any, role:any) => total + role.episode_count, 0);
  }
  showTrailer(): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      this.isTrailerVisible = true;
      this.clickListener = this.renderer.listen('document', 'click', (event: Event) => {
      const targetElement = event.target as HTMLElement;
      if (targetElement.classList.contains('video-overlay')&&!targetElement.classList.contains('video-container')) {
        this.closeTrailer();
      }
    });
    }
  }
  closeTrailer(): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      this.isTrailerVisible = false;
      if (this.clickListener) {
        this.clickListener();
      }
    }
  }
  showVideo(index:number): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      this.isVideoVisible = true;
      this.currentVideoIndex = index;
      this.clickListener = this.renderer.listen('document', 'click', (event: Event) => {
      const targetElement = event.target as HTMLElement;
      if (targetElement.classList.contains('media-video-overlay')&&!targetElement.classList.contains('media-video-container')) {
        this.closeVideo();
      }
    });
    }
  }
  closeVideo(): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      this.isVideoVisible = false;
      this.currentVideoIndex = null;
      if (this.clickListener) {
        this.clickListener();
      }
    }
  }
  setMediaActiveTab(tab: string) {
    this.mediaActiveTab = tab;
  }
  ngOnDestroy(): void {
    if (this.clickListener) {
      this.clickListener();
    }
  }
}